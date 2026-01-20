# Web Tour Testing Guide

## How to Test the Feature

### 1. First Time User Experience

1. **Clear your browser's localStorage** (or use incognito mode)
2. Navigate to the homepage: `http://localhost:3000`
3. You should see the language selector with a prompt
4. Select either **English** or **हिन्दी**
5. After ~800ms, the tour should automatically start
6. Progress through all 4 steps of the tour

### 2. Tour Steps to Verify

#### Step 1: Welcome

- ✅ Shows centered welcome message
- ✅ Text is in selected language
- ✅ Has "Start Tour" button
- ✅ Modal overlay blocks background interaction

#### Step 2: Magnifying Glass

- ✅ Highlights the magnifying glass button (right side)
- ✅ Shows explanation text
- ✅ Has "Next" button
- ✅ Arrow points to the element

#### Step 3: Chatbot

- ✅ Highlights the chatbot button (bottom right)
- ✅ Shows explanation text
- ✅ Has "Next" button
- ✅ Arrow points to the element

#### Step 4: Get Started

- ✅ Highlights "Get Started" button in header
- ✅ Shows explanation text
- ✅ Has "Finish Tour" button
- ✅ Tour completes and saves state

### 3. Language Switching

1. Complete the tour in English
2. Clear `tourCompleted` from localStorage:
   ```javascript
   localStorage.removeItem("tourCompleted");
   ```
3. Change language to Hindi via the language selector
4. Tour should restart in Hindi
5. Verify all text is properly translated

### 4. Tour Persistence

1. Complete the tour
2. Refresh the page
3. ✅ Tour should NOT start again
4. ✅ Language preference should persist
5. ✅ All localStorage flags should be set

### 5. Manual Tour Reset

To test multiple times:

```javascript
// In browser console
localStorage.removeItem("tourCompleted");
localStorage.removeItem("languageSelected");
localStorage.removeItem("selectedLanguage");
// Refresh page
location.reload();
```

## Expected Behavior

### ✅ Correct Behavior

- Tour starts automatically after language selection
- Tour shows in the correct language
- Steps highlight the correct elements
- Modal overlay prevents accidental clicks
- Tour can be cancelled with X button or ESC key
- Tour saves completion state
- Completed tour doesn't show again

### ❌ Issues to Watch For

- Tour not starting after language selection
- Elements not being highlighted
- Wrong language being displayed
- Tour restarting on every page load
- Cannot close the tour
- Tour blocking essential functionality

## Browser Testing Checklist

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

## Keyboard Accessibility

- [ ] ESC key closes the tour
- [ ] Enter key advances to next step
- [ ] Tab key navigates between buttons
- [ ] Focus is properly managed

## Visual Checks

- [ ] Tour popups are properly styled (orange/amber theme)
- [ ] Arrows point to correct elements
- [ ] Text is readable and not cut off
- [ ] Buttons are clickable and visible
- [ ] Modal overlay is semi-transparent
- [ ] Animations are smooth

## Console Checks

Open browser console and verify:

- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] localStorage is being updated correctly

## Integration Points

The tour integrates with:

1. **LanguageSelector** - Listens for `languageChange` event
2. **MagnifyingGlass** - Uses class `magnifying-glass-toggle`
3. **Chatbot** - Uses class `chatbot-toggle`
4. **Header** - Uses class `get-started-button`

## Troubleshooting

### Tour doesn't start

- Check if `tourCompleted` is in localStorage
- Verify language has been selected
- Check browser console for errors
- Ensure shepherd.js is installed: `npm list shepherd.js`

### Wrong language displayed

- Check localStorage `selectedLanguage` value
- Verify language selector is working
- Check browser console for `languageChange` event

### Elements not highlighting

- Inspect element and verify class names exist:
  - `.magnifying-glass-toggle`
  - `.chatbot-toggle`
  - `.get-started-button`
- Check if components have rendered
- Verify z-index of elements

### Styling issues

- Check if `shepherd-custom.css` is imported
- Verify CSS is loaded in Network tab
- Check for CSS conflicts in devtools

## Success Criteria

✅ Tour successfully guides users through all 4 steps  
✅ Language selection works and persists  
✅ Tour respects user's language choice  
✅ Tour doesn't show again after completion  
✅ All interactive elements are properly highlighted  
✅ Tour is accessible and responsive  
✅ No console errors or warnings
