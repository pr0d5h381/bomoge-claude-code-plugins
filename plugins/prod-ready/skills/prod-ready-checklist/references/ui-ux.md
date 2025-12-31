# UI/UX Completeness Checklist

## Critical Checks

### Error Pages
- **404 Page**: Custom, branded, helpful
- **500 Page**: User-friendly error with contact info
- **Offline Page**: For PWAs, graceful offline handling

```bash
# Check for error pages
find . -name "*404*" -o -name "*error*" -o -name "*not-found*"
```

### Error Boundaries (React)
```jsx
// Every major section should have error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <MainContent />
</ErrorBoundary>
```

## Warning Checks

### Loading States
Every async operation needs:
- Loading indicator (spinner, skeleton, progress)
- Disabled interactions during load
- Timeout handling

```jsx
// BAD - No loading state
const data = await fetchData();
return <List items={data} />;

// GOOD - With loading state
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
return <List items={data} />;
```

**Check these common locations:**
- Page initial loads
- Form submissions
- Data fetching
- File uploads
- Search/filter operations

### Empty States
Every list/collection needs:
- Empty state message
- Call-to-action (if applicable)
- Illustration or icon (optional)

```jsx
// Empty state example
if (items.length === 0) {
  return (
    <EmptyState
      icon={<FolderIcon />}
      title="No items yet"
      description="Create your first item to get started"
      action={<Button>Create Item</Button>}
    />
  );
}
```

**Check:**
- Lists and tables
- Search results
- User collections
- Notifications
- Messages/inbox

### Error States
Every operation that can fail needs:
- Clear error message
- Retry option (if applicable)
- Help or support link

```jsx
// Error state example
if (error) {
  return (
    <Alert variant="error">
      <AlertTitle>Failed to load data</AlertTitle>
      <AlertDescription>
        {error.message}
        <Button onClick={retry}>Try Again</Button>
      </AlertDescription>
    </Alert>
  );
}
```

### Form Validation
- Real-time validation feedback
- Clear error messages
- Success confirmation
- Accessible error announcements

```jsx
// Form validation
<Input
  error={errors.email}
  helperText={errors.email?.message}
  aria-invalid={!!errors.email}
  aria-describedby="email-error"
/>
```

### Confirmation Dialogs
Destructive actions require confirmation:
- Delete operations
- Account deletion
- Data clearing
- Irreversible changes

```jsx
// Confirmation dialog
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogTitle>Delete Item?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>
      Delete
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

### User Feedback
- Success messages (toasts, alerts)
- Progress indicators for long operations
- Optimistic updates with rollback
- Action confirmations

## Info Checks

### Micro-interactions
- Button hover/active states
- Input focus states
- Transition animations
- Loading progress

### Consistent Patterns
- Same loading indicators throughout
- Consistent error handling
- Unified empty states
- Standard confirmation dialogs

### Mobile-First Considerations
- Touch targets (min 44x44px)
- Swipe gestures where appropriate
- Bottom sheets for mobile modals
- Sticky headers/footers

## Checklist by Page Type

### List/Table Pages
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Error state
- [ ] Pagination/infinite scroll
- [ ] Sort/filter indicators

### Form Pages
- [ ] Validation messages
- [ ] Submit loading state
- [ ] Success confirmation
- [ ] Error handling
- [ ] Unsaved changes warning

### Detail Pages
- [ ] Loading state
- [ ] Not found handling
- [ ] Error state
- [ ] Back navigation

### Authentication Pages
- [ ] Loading during auth
- [ ] Error messages
- [ ] Password visibility toggle
- [ ] Forgot password link
- [ ] Terms/privacy links

## Search Patterns

```bash
# Find components missing loading states
grep -rn "isLoading\|loading" --include="*.{tsx,jsx}"

# Find potential empty state locations
grep -rn "\.map(" --include="*.{tsx,jsx}"

# Find form components
grep -rn "<form\|<Form\|useForm" --include="*.{tsx,jsx}"
```
