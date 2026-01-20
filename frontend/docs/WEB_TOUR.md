# Web Tour Feature Documentation

## Overview

The web tour feature provides an interactive, guided walkthrough for first-time users of the Sahay platform. It uses Shepherd.js to highlight key features including the magnifying glass, chatbot, and login button.

## Features

### 1. **Language Support**

- The tour automatically detects the user's selected language from localStorage
- Supports English and Hindi translations
- Tour content dynamically updates based on language selection

### 2. **Automatic Triggering**

The tour automatically starts when:

- User selects a language for the first time
- User hasn't completed the tour before
- All required components are rendered on the page

### 3. **Tour Steps**

#### Step 1: Welcome

- Introduces the user to the platform
- Explains what the tour will cover
- Button: "Start Tour" / "दौरा शुरू करें"

#### Step 2: Magnifying Glass

- Highlights the magnifying glass feature (right side of screen)
- Explains how to use the zoom functionality
- Positioned: Bottom of the magnifying glass button

#### Step 3: Chatbot

- Highlights the AI chatbot button (bottom right)
- Explains how to get help and guidance
- Positioned: Left of the chatbot button

#### Step 4: Get Started

- Highlights the "Get Started" button in the header
- Encourages user to sign up or log in
- Button: "Finish Tour" / "दौरा समाप्त करें"

## Implementation Details

### Components Modified

1. **`components/web-tour.tsx`** (NEW)

   - Main tour component
   - Manages tour lifecycle and translations
   - Listens for language changes

2. **`components/magnifying-glass.tsx`**

   - Added class: `magnifying-glass-toggle`

3. **`components/chatbot.tsx`**

   - Added class: `chatbot-toggle`

4. **`components/header.tsx`**

   - Added class: `get-started-button`

5. **`app/layout.tsx`**

   - Imported WebTour component
   - Imported shepherd-custom.css

6. **`app/shepherd-custom.css`** (NEW)
   - Custom styling for tour popups
   - Matches Sahay branding (orange/amber theme)
   - Responsive design

### LocalStorage Keys

- `selectedLanguage`: User's chosen language ("en" or "hi")
- `languageSelected`: Flag indicating user has selected a language
- `tourCompleted`: Flag indicating tour has been completed

### Dependencies

```json
{
  "shepherd.js": "^13.0.0"
}
```

## Customization

### Adding New Languages

Edit `components/web-tour.tsx`:

```typescript
const tourTranslations = {
  en: {
    /* English translations */
  },
  hi: {
    /* Hindi translations */
  },
  // Add new language
  es: {
    welcome: {
      title: "¡Bienvenido a Sahay! 🎉",
      text: "...",
      button: "Comenzar Tour",
    },
    // ... other steps
  },
};
```

### Modifying Tour Steps

Edit the `startTour()` function in `components/web-tour.tsx`:

```typescript
tour.addStep({
  id: "step-id",
  text: `<div>Your HTML content</div>`,
  attachTo: {
    element: ".css-selector",
    on: "bottom", // top, bottom, left, right
  },
  buttons: [
    {
      text: "Button Text",
      action: tour.next,
      classes: "shepherd-button-primary",
    },
  ],
});
```

### Styling

Edit `app/shepherd-custom.css` to customize:

- Colors and theme
- Button styles
- Animation effects
- Responsive breakpoints

## Usage Flow

1. User visits the homepage
2. Language selector prompts for language selection
3. User selects English or Hindi
4. Language preference is saved to localStorage
5. After 800ms delay (for UI to settle), tour automatically starts
6. User progresses through 4 tour steps
7. Tour completion status is saved to localStorage
8. Tour won't show again on subsequent visits

## Resetting the Tour

To test or reset the tour, run in browser console:

```javascript
localStorage.removeItem("tourCompleted");
localStorage.removeItem("languageSelected");
```

Then refresh the page and select a language again.

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design included

## Performance Considerations

- Tour loads only when needed (lazy)
- Uses CSS animations for smooth transitions
- Minimal bundle size impact (~50KB)
- No performance impact when tour is not active

## Accessibility

- Keyboard navigation supported (ESC to close, Enter to proceed)
- Focus management handled by Shepherd.js
- Modal overlay prevents interaction with background elements
- High contrast for readability

## Future Enhancements

- [ ] Add more language options
- [ ] Create dashboard-specific tour for logged-in users
- [ ] Add video/GIF demonstrations in tour steps
- [ ] Implement tour progress tracking analytics
- [ ] Add option to restart tour from user settings
