# ModelTracker

The ModelTracker is a system for managing and selecting AI models based on their availability, capabilities, and rate limits. It provides a standardized way to wrap different types of LangChain models and track their usage.

## Key Features

- **Model Abstraction**: Provides a common interface for different model types (Google Gemini, Ollama, Groq, etc.)
- **Rate Limiting**: Tracks usage and enforces rate limits for each model
- **Availability Checking**: Determines if a model is available based on its rate limits
- **Preferred Order Selection**: Selects models based on a configurable preferred order
- **Usage Statistics**: Tracks usage statistics for each model

## Architecture

The ModelTracker system consists of the following components:

### BaseModelWrapper

An abstract class that all model wrappers must extend. It provides:

- Common interface for all model types
- Usage tracking
- Rate limit enforcement
- Availability checking

### Concrete Model Wrappers

- `GoogleGenerativeAIWrapper`: For Google Gemini models
- `OllamaWrapper`: For local Ollama models
- `GroqWrapper`: For Groq models

### ModelTracker

A singleton class that:

- Registers model wrappers
- Manages the preferred order of models
- Provides methods to get models based on criteria and availability

## Rate Limits

The system supports the following rate limits:

- **Gemini Models**:
  - 15 requests per minute
  - 1,000,000 tokens per minute
  - 1,500 requests per day

- **Groq Models**:
  - 30 requests per minute
  - 6,000 tokens per minute
  - 100,000 tokens per day
  - 1,000 requests per day

- **Local Ollama Models**:
  - Unlimited requests

## Usage Example

```typescript
// Get a model that supports tools and is available
const toolModel = modelTracker.getAvailableModel({ toolEnabled: true });

// Use the model
if (toolModel) {
  const model = toolModel.getModel();
  // Use the model for inference
  
  // Track usage after using the model
  toolModel.trackUsage(tokenCount);
}
```

## Extending with Custom Models

You can create custom model wrappers by extending the `BaseModelWrapper` class:

```typescript
class CustomModelWrapper extends BaseModelWrapper<YourModelType> {
  constructor(key: string, model: YourModelType, metadata: ModelMetadata) {
    const customRateLimits = {
      requestsPerMinute: 10,
      tokensPerMinute: 50000,
    };
    
    super(key, model, metadata, customRateLimits);
  }
  
  // Override methods as needed
  public override isAvailable(): boolean {
    // Custom availability logic
    return super.isAvailable() && yourCustomCondition;
  }
}
```

## Context Size Categories

Models are categorized by their context size:

- `SMALL`: < 32,000 tokens
- `MEDIUM`: 32,000 - 128,000 tokens
- `LARGE`: 128,000 - 2,000,000 tokens
- `EXTRA_LARGE`: > 2,000,000 tokens 