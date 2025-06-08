# TODO: Deleted Works Handling System

## Problem Statement

Deleted AO3 works appear in reading history with placeholder data that corrupts statistics and visualizations. These works have consistent patterns:
- Empty `id` field
- Title: "Unknown Title"
- Author: "Anonymous" 
- Zero word count and visits
- "Unknown" values for most metadata
- Empty fandoms array

**Impact**: Statistics show inflated author counts (e.g., Anonymous with 17 works instead of 10), charts include zero-value data points, and filter dropdowns contain "Unknown" values.

## Technical Requirements

### Core Principles
- **Data Integrity**: Preserve original JSON data for extension compatibility
- **Non-destructive Processing**: Filter at processing layer, not data layer
- **Separation of Concerns**: Keep detection logic in utilities, UI controls in components
- **Backward Compatibility**: Maintain existing API contracts
- **Performance**: Efficient filtering for large datasets (6000+ works)

## Implementation Plan

### Phase 1: Core Detection & Statistics Fix (COMPLETED ✅)

#### 1.1 Add Deleted Work Detection Function ✅
**File**: `src/utils/dataProcessing.ts`
**Status**: IMPLEMENTED

```typescript
// Detect deleted/unavailable works based on consistent patterns
export const isDeletedWork = (work: WorkData): boolean => {
  return (
    work.id === "" &&
    work.title === "Unknown Title" &&
    work.author === "Anonymous" &&
    work.url === null &&
    work.authorUrl === null &&
    work.fandoms.length === 0 &&
    work.stats.wordCount === 0 &&
    work.userStats.lastVisited === "Unknown" &&
    work.rating === "Unknown" &&
    work.category === "Unknown" &&
    work.completion === "Unknown"
  );
};
```

#### 1.2 Update Statistics Generation ✅
**Status**: IMPLEMENTED - Statistics now exclude deleted works

```typescript
export const generateStats = (works: WorkData[]): StatSummary => {
  // Filter out deleted works for accurate statistics
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  if (validWorks.length === 0) {
    // Return empty stats...
  }
  
  // Continue with validWorks instead of works...
}
```

#### 1.3 Update Chart Data Generation ✅
**Status**: IMPLEMENTED - Charts now exclude deleted works

```typescript
export const generateChartData = (works: WorkData[]): Record<string, ChartData> => {
  // Filter out deleted works for clean visualizations
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  if (validWorks.length === 0) {
    // Return empty charts...
  }
  
  // Continue with validWorks instead of works...
}
```

#### 1.4 Update Filter Options Extraction ✅
**Status**: IMPLEMENTED - Filter dropdowns now exclude 'Unknown' values

```typescript
export const extractFilterOptions = (works: WorkData[]) => {
  // Filter out deleted works to clean up filter options
  const validWorks = works.filter(work => !isDeletedWork(work));
  
  // Continue with validWorks...
}
```

### Phase 2: Table Display Enhancement (COMPLETED ✅)

#### 2.1 Enhanced Table Display for Deleted Works ✅
**File**: `src/components/DataTable/WorksTable.tsx`
**Status**: IMPLEMENTED

**Features Implemented:**
- Deleted works display "Deleted Work" as title
- Authors display as "Unknown" for deleted works  
- Italic gray styling differentiates deleted works
- Links are disabled for deleted works
- Tooltips work correctly for deleted works
- Statistics and visualizations exclude deleted works (from Phase 1)
- Filter options are clean without "Unknown" values (from Phase 1)

### Phase 3: Export Data Consistency (REQUIRED - High Priority)

**Critical Issue**: Exported data shows raw values ("Unknown Title", "Anonymous") instead of UI display values ("Deleted Work", "Unknown"), creating user confusion.

#### 3.1 Update Export Functions
**File**: `src/utils/exportUtils.ts`
**Change**: Transform deleted work data to match UI display

```typescript
// Transform deleted works to show consistent values
import { isDeletedWork } from './dataProcessing';

// In each export function, transform the data:
const transformWorkForExport = (work: WorkData): WorkData => {
  if (isDeletedWork(work)) {
    return {
      ...work,
      title: "Deleted Work",
      author: "Unknown"
    };
  }
  return work;
};

// Apply transformation in export functions:
export const exportToExcel = (works: WorkData[], filename: string) => {
  const transformedWorks = works.map(transformWorkForExport);
  // Continue with existing export logic using transformedWorks
};

export const exportToCSV = (works: WorkData[], filename: string) => {
  const transformedWorks = works.map(transformWorkForExport);
  // Continue with existing export logic using transformedWorks
};

export const exportToJSON = (works: WorkData[], filename: string) => {
  const transformedWorks = works.map(transformWorkForExport);
  // Continue with existing export logic using transformedWorks
};
```

**Rationale**: Users see "Deleted Work" and "Unknown" in the UI, so exports should match for consistency. This avoids confusion when exported data shows different values than what's displayed.

## Testing Strategy

### Unit Tests
1. **isDeletedWork()** function with various work objects
2. **generateStats()** with mixed valid/deleted works
3. **filterWorks()** with showDeletedWorks toggle
4. Edge cases: empty datasets, all deleted works

### Integration Tests
1. Statistics accuracy before/after filtering
2. Chart data consistency
3. Filter dropdown cleanliness
4. Table display with mixed data

### Performance Tests
1. Large dataset filtering (6000+ works)
2. Memory usage with filter operations
3. Chart rendering performance

## Validation Checklist

### Phase 1 Completion Criteria
- [ ] `isDeletedWork()` function implemented and tested
- [ ] Statistics exclude deleted works
- [ ] Charts exclude deleted works  
- [ ] Filter options exclude deleted works
- [ ] No "Unknown" values in dropdowns
- [ ] Anonymous author count accurate
- [ ] Build passes without errors
- [ ] Performance maintained with large datasets

### Phase 2 Completion Criteria
- [ ] User can toggle deleted works visibility
- [ ] Table clearly indicates deleted works when shown
- [ ] Filter state persists across navigation
- [ ] Default behavior hides deleted works

### Phase 3 Completion Criteria
- [ ] Export data consistency implemented
- [ ] "Deleted Work" and "Unknown" values in exported files match UI display
- [ ] All export formats (Excel, CSV, JSON) use transformed values

## Implementation Notes

### Performance Considerations
- Use `Array.filter()` efficiently for large datasets
- Cache deleted work detection results if needed
- Minimize re-filtering on state changes

### Error Handling
- Handle edge cases where detection patterns might change
- Graceful degradation if detection fails
- Console warnings for unexpected data patterns

### Future Extensibility
- Design detection function to handle pattern variations
- Allow for configurable detection criteria
- Support for other types of data quality issues

## Dependencies
- No new external dependencies required
- Leverages existing TypeScript/React patterns
- Uses established data processing utilities

## Estimated Timeline
- **Phase 1**: 2-3 hours (core functionality)
- **Phase 2**: 1-2 hours (table enhancements)
- **Phase 3**: 1 hour (UI controls)
- **Phase 4**: 30 minutes (export updates)
- **Testing**: 1 hour
- **Total**: 5-7 hours

## Rollback Plan
If issues arise, revert changes in reverse order:
1. Remove UI controls (Phase 3)
2. Remove table enhancements (Phase 2)  
3. Revert core filtering (Phase 1)

Each phase is independent and can be reverted without affecting others.