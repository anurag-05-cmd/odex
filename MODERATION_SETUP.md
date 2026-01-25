# OpenAI Moderation API Integration Guide

## Overview
Your marketplace now includes content moderation using OpenAI's moderation API. Every listing is checked to ensure:
- ✅ Contains no derogatory or inappropriate language
- ✅ Is written in English only

## How It Works

### Content Checks

**1. Language Detection**
- Analyzes text for non-ASCII characters
- Ensures content is in English
- Rejects listings with 30%+ non-ASCII characters

**2. Derogatory Language Detection**
- Uses OpenAI's Moderation API (`text-moderation-latest` model)
- Checks for:
  - Hate speech
  - Harassment
  - Violence
  - Sexual content
  - Self-harm references
  - And other inappropriate categories

### Flow Diagram

```
User fills listing form
    ↓
Clicks "Create Listing"
    ↓
Frontend calls /api/moderation/check
    ↓
API checks language (English only)
    ↓
API calls OpenAI moderation endpoint
    ↓
If flagged → Show error message
If passed → Proceed with blockchain transaction
```

## API Endpoints

### POST /api/moderation/check

**Request:**
```typescript
{
  title: string;
  description: string;
}
```

**Success Response (200):**
```json
{
  "flagged": false,
  "message": "Content passed moderation"
}
```

**Blocked Response (200):**
```json
{
  "flagged": true,
  "reason": "NON_ENGLISH",
  "message": "Listings must be in English only. Please rewrite your listing in English."
}
```

Or for derogatory content:
```json
{
  "flagged": true,
  "reason": "hate, harassment",
  "message": "Your listing contains inappropriate content. Please remove derogatory language and try again."
}
```

## Environment Variables

```env
OPENAI_API_KEY=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
```

Already configured in your `.env` file.

## Frontend Integration

### Usage in Listings Page

```typescript
import { moderateListingContent } from "../utils/moderation";

const handleCreateListing = async (e: React.FormEvent) => {
  // ... validation ...

  try {
    // Check content against moderation API
    const moderationResult = await moderateListingContent(
      formData.title,
      formData.description
    );

    if (moderationResult.flagged) {
      alert(`Content blocked: ${moderationResult.message}\n\nReason: ${moderationResult.reason}`);
      return;
    }

    // Proceed with listing creation
    // ...
  } catch (error) {
    alert("Moderation check failed. Please try again.");
  }
};
```

## Testing Examples

### ✅ Passes Moderation

```
Title: "Gaming Laptop RTX 4070"
Description: "High-performance gaming laptop in excellent condition. Includes original box and charger. Works perfectly."
```

### ❌ Fails - Non-English

```
Title: "电子游戏笔记本"
Description: "这是一个高性能游戏笔记本"
```
**Blocked:** "Listings must be in English only"

### ❌ Fails - Derogatory Language

```
Title: "Laptop"
Description: "This item is great unless you're [derogatory term]. Serious buyers only."
```
**Blocked:** "Your listing contains inappropriate content"

## Error Handling

All errors are caught and handled gracefully:

```typescript
try {
  const result = await moderateListingContent(title, description);
  if (result.flagged) {
    // Show user-friendly error message
  }
} catch (error) {
  // If moderation service fails, still allow user to create listing
  // but log the error for debugging
}
```

## OpenAI API Details

- **Endpoint:** `https://api.openai.com/v1/moderations`
- **Model:** `text-moderation-latest`
- **Method:** POST
- **Rate Limits:** 1,500 requests per minute
- **Cost:** Free tier available

## Categories Checked

The OpenAI moderation API checks for:

1. **hate** - Content expressing hatred
2. **hate/threatening** - Hateful content with threats
3. **harassment** - Harassing or bullying content
4. **harassment/threatening** - Harassment with threats
5. **self-harm** - Content promoting self-harm
6. **self-harm/intent** - Content indicating self-harm intent
7. **self-harm/instructions** - Instructions for self-harm
8. **sexual** - Sexual content
9. **sexual/minors** - Sexual content involving minors
10. **violence** - Violent content
11. **violence/graphic** - Graphic violent content

## Deployment Considerations

### Vercel
- ✅ API routes work seamlessly
- ✅ Environment variables properly configured
- ✅ No additional setup required

### Rate Limiting
- OpenAI free tier: 1,500 requests/min
- Your marketplace: ~1 moderation call per listing creation
- Easily within limits for typical usage

### Privacy
- Only title and description are sent to OpenAI
- No user wallet addresses or personal data
- API calls are encrypted (HTTPS)

## Troubleshooting

**"Moderation service not configured"**
- Ensure `OPENAI_API_KEY` is set in `.env`
- Verify the API key is not expired

**"Moderation check failed"**
- Check OpenAI API status: https://status.openai.com
- Verify network connectivity
- Check API key permissions

**False Positives**
- Some legitimate content might be flagged
- Users should rephrase content to avoid triggering filters
- Examples: Medical terms, academic discussions of sensitive topics

## Future Enhancements

- Add category-specific filtering rules
- Implement user appeal/override system (for admins)
- Add logging and analytics for moderated content
- Cache moderation results for identical content
- Add additional language support beyond English

## Files Changed

```
app/
├── api/
│   └── moderation/
│       └── check/
│           └── route.ts          (NEW)
├── utils/
│   ├── moderation.ts              (NEW)
│   └── constants.ts               (unchanged)
└── listings/
    └── page.tsx                   (UPDATED)

.env                               (UPDATED)
```
