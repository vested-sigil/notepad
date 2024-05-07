
//limits.js
const statusCodes = {
    success: {
      "200": "Notion successfully processed the request."
    },
    error: {
      "400": {
        "invalid_json": "The request body could not be decoded as JSON.",
        "invalid_request_url": "The request URL is not valid.",
        "invalid_request": "This request is not supported.",
        "invalid_grant": "The provided authorization grant (e.g., authorization code, resource owner credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.",
        "validation_error": "The request body does not match the schema for the expected parameters.",
        "missing_version": "The request is missing the required Notion-Version header."
      },
      "401": "The bearer token is not valid.",
      "403": "Given the bearer token used, the client doesn’t have permission to perform this operation.",
      "404": "Given the bearer token used, the resource does not exist.",
      "409": "The transaction could not be completed, potentially due to a data collision.",
      "429": "This request exceeds the number of requests allowed.",
      "500": "An unexpected error occurred.",
      "502": "Notion encountered an issue while attempting to complete this request (e.g., failed to establish a connection with an upstream server).",
      "503": {
        "service_unavailable": "Notion is unavailable. This can occur when the time to respond to a request takes longer than 60 seconds, the maximum request timeout.",
        "database_connection_unavailable": "Notion’s database is unavailable or is not in a state that can be queried."
      },
      "504": "Notion timed out while attempting to complete this request."
    }
  };
  
  class NotionRateLimit {
    constructor() {
      this.rateLimitPerSec = 3;
      this.retryAfterSec = null;
      this.errorCode = 429;
    }
  
    handleRateLimit() {
      if (this.errorCode === 429) {
        // Handle the Rate Limit by implementing a logic to pause the request and retry after the specified time
        setTimeout(() => {
          // Retry Request
        }, this.retryAfterSec * 1000);
      }
    }
  }
  
  class NotionSizeLimit {
    constructor() {
      this.propertyLimits = {
        '/reference/rich-text': { 'text.content': 2000, 'text.link.url': 2000, 'equation.expression': 1000 },
        'Any array of all /reference/block types, including /reference/rich-text': 100,
        'Any URL': 2000,
        'Any email': 200,
        'Any phone number': 200,
        'Any multi-select': 100,
        'Any relation': 100,
        'Any people': 100
      };
  
      this.maxBlockElements = 1000;
      this.maxPayloadSizeKB = 500;
      this.errorCode = 400;
      this.errorMessage = null;
    }
  
    handleSizeLimit() {
      if (this.errorCode === 400) {
        // Handle the Size Limit by implementing a logic to check the size of the request before making the API call
        // If the size of the request exceeds the limit, throw an error or alert the user
      }
    }
  }
  
  // Example usage
  const rateLimit = new NotionRateLimit();
  rateLimit.handleRateLimit();
  
  const sizeLimit = new NotionSizeLimit();
  sizeLimit.handleSizeLimit();
  
