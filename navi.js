const NotionClient = require('./NotionClient');
const helper = require('./helper');

class PageNavigator {
    constructor() {
        this.client = new NotionClient();
    }

    async navigateToPage(pageId) {
        try {
            const page = await this.client.handleRequest('pages.retrieve', { page_id: pageId });
            helper.log(`Navigated to page: ${page.id}`);
            return page;
        } catch (error) {
            helper.logError(error, 'Error navigating to page:');
            throw error;
        }
    }

    async getPageContent(pageId) {
        try {
            const blocks = await this.client.handleRequest('blocks.children.list', { block_id: pageId });
            helper.log(`Retrieved content for page: ${pageId}`);
            return blocks.results;
        } catch (error) {
            helper.logError(error, 'Error retrieving page content:');
            throw error;
        }
    }

    async displayPage(pageId) {
        try {
            const page = await this.navigateToPage(pageId);
            const content = await this.getPageContent(pageId);
            return this.formatPageDisplay(page, content);
        } catch (error) {
            helper.logError(error, 'Error displaying page:');
            throw error;
        }
    }

    formatPageDisplay(page, content) {
        let display = `Title: ${helper.getNestedProperty(page, 'properties.title.title[0].plain_text') || 'Untitled'}\n\n`;

        content.forEach(block => {
            switch (block.type) {
                case 'paragraph':
                    display += `${block.paragraph.rich_text.map(t => t.plain_text).join('')}\n\n`;
                    break;
                case 'heading_1':
                    display += `# ${block.heading_1.rich_text.map(t => t.plain_text).join('')}\n\n`;
                    break;
                case 'heading_2':
                    display += `## ${block.heading_2.rich_text.map(t => t.plain_text).join('')}\n\n`;
                    break;
                case 'heading_3':
                    display += `### ${block.heading_3.rich_text.map(t => t.plain_text).join('')}\n\n`;
                    break;
                case 'bulleted_list_item':
                    display += `• ${block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}\n`;
                    break;
                case 'numbered_list_item':
                    display += `1. ${block.numbered_list_item.rich_text.map(t => t.plain_text).join('')}\n`;
                    break;
                case 'to_do':
                    const checkbox = block.to_do.checked ? '[x]' : '[ ]';
                    display += `${checkbox} ${block.to_do.rich_text.map(t => t.plain_text).join('')}\n`;
                    break;
                // Add more cases for other block types as needed
                default:
                    display += `[Unsupported block type: ${block.type}]\n`;
            }
        });

        return display;
    }

    async navigateToLinkedPage(currentPageId, linkText) {
        try {
            const content = await this.getPageContent(currentPageId);
            const linkedBlock = content.find(block => 
                block.type === 'paragraph' && 
                block.paragraph.rich_text.some(t => 
                    t.type === 'mention' && 
                    t.mention.type === 'page' && 
                    t.plain_text.toLowerCase() === linkText.toLowerCase()
                )
            );

            if (linkedBlock) {
                const linkedPageId = linkedBlock.paragraph.rich_text.find(t => 
                    t.type === 'mention' && t.mention.type === 'page'
                ).mention.page.id;
                return this.navigateToPage(linkedPageId);
            } else {
                throw new Error(`No link found with text: ${linkText}`);
            }
        } catch (error) {
            helper.logError(error, 'Error navigating to linked page:');
            throw error;
        }
    }

    async searchPages(query) {
        try {
            const results = await this.client.handleRequest('search', { query });
            return helper.mapNotionResponse(results, item => ({
                id: item.id,
                title: helper.getNestedProperty(item, 'properties.title.title[0].plain_text') || 'Untitled',
                url: item.url
            }));
        } catch (error) {
            helper.logError(error, 'Error searching pages:');
            throw error;
        }
    }
}

module.exports = new PageNavigator();