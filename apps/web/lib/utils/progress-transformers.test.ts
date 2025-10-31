import { describe, expect, test } from 'vitest';

import type {
  CourseAttendanceRate,
  DanceCategoryStats,
  InstructorStats,
  MasteredDanceCategory,
} from '@/lib/model/enroll';
import {
  calculateTotalHours,
  transformCourseAttendanceToProgressItems,
  transformDanceCategoryStatsToChartData,
  transformInstructorStatsToChartData,
  transformMasteredCategoriesToProgressItems,
} from './progress-transformers';

describe('transformDanceCategoryStatsToChartData', () => {
  test('transforms array of dance category stats to chart data format', () => {
    const stats: DanceCategoryStats[] = [
      { danceCategoryName: 'Ballet', spentHours: 10 },
      { danceCategoryName: 'Jazz', spentHours: 15 },
      { danceCategoryName: 'Hip Hop', spentHours: 8 },
    ];

    const result = transformDanceCategoryStatsToChartData(stats);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'Ballet', value: 10 });
    expect(result[1]).toEqual({ name: 'Jazz', value: 15 });
    expect(result[2]).toEqual({ name: 'Hip Hop', value: 8 });
  });

  test('handles empty array', () => {
    const result = transformDanceCategoryStatsToChartData([]);
    expect(result).toHaveLength(0);
  });

  test('handles single item', () => {
    const stats: DanceCategoryStats[] = [{ danceCategoryName: 'Ballet', spentHours: 10 }];
    const result = transformDanceCategoryStatsToChartData(stats);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'Ballet', value: 10 });
  });

  test('handles zero hours', () => {
    const stats: DanceCategoryStats[] = [
      { danceCategoryName: 'Ballet', spentHours: 0 },
      { danceCategoryName: 'Jazz', spentHours: 5 },
    ];

    const result = transformDanceCategoryStatsToChartData(stats);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'Ballet', value: 0 });
    expect(result[1]).toEqual({ name: 'Jazz', value: 5 });
  });
});

describe('transformInstructorStatsToChartData', () => {
  test('transforms array of instructor stats to chart data format', () => {
    const stats: InstructorStats[] = [
      { instructorFirstname: 'John', instructorSurname: 'Doe', spentHours: 20 },
      { instructorFirstname: 'Alice', instructorSurname: 'Smith', spentHours: 15 },
      { instructorFirstname: 'Bob', instructorSurname: 'Johnson', spentHours: 30 },
    ];

    const result = transformInstructorStatsToChartData(stats);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'John Doe', value: 20 });
    expect(result[1]).toEqual({ name: 'Alice Smith', value: 15 });
    expect(result[2]).toEqual({ name: 'Bob Johnson', value: 30 });
  });

  test('handles empty array', () => {
    const result = transformInstructorStatsToChartData([]);
    expect(result).toHaveLength(0);
  });

  test('handles single item', () => {
    const stats: InstructorStats[] = [
      { instructorFirstname: 'John', instructorSurname: 'Doe', spentHours: 20 },
    ];

    const result = transformInstructorStatsToChartData(stats);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'John Doe', value: 20 });
  });

  test('handles names with special characters', () => {
    const stats: InstructorStats[] = [
      { instructorFirstname: "Jean-Pierre", instructorSurname: "D'Artagnan", spentHours: 25 },
      { instructorFirstname: 'Mary-Jane', instructorSurname: 'Watson', spentHours: 18 },
    ];

    const result = transformInstructorStatsToChartData(stats);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "Jean-Pierre D'Artagnan", value: 25 });
    expect(result[1]).toEqual({ name: 'Mary-Jane Watson', value: 18 });
  });

  test('handles zero hours', () => {
    const stats: InstructorStats[] = [
      { instructorFirstname: 'John', instructorSurname: 'Doe', spentHours: 0 },
      { instructorFirstname: 'Alice', instructorSurname: 'Smith', spentHours: 10 },
    ];

    const result = transformInstructorStatsToChartData(stats);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'John Doe', value: 0 });
    expect(result[1]).toEqual({ name: 'Alice Smith', value: 10 });
  });
});

describe('transformCourseAttendanceToProgressItems', () => {
  test('transforms array of course attendance rates to progress items format (with one or more instructors)', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: true,
        instructorsNames: ['John Doe', 'Alice Smith'],
        attendedCount: 5,
        allCount: 10,
      },
      {
        courseName: 'Jazz Intermediate',
        hasStarted: true,
        instructorsNames: ['Bob Johnson'],
        attendedCount: 8,
        allCount: 12,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      primaryText: 'Ballet Fundamentals',
      secondaryText: 'Attendance: 5/10',
      tertiaryText: 'Instructor: John Doe, Alice Smith',
    });
    expect(result[1]).toEqual({
      primaryText: 'Jazz Intermediate',
      secondaryText: 'Attendance: 8/12',
      tertiaryText: 'Instructor: Bob Johnson',
    });
  });

  test('filters out courses that have not started', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: true,
        instructorsNames: ['John Doe'],
        attendedCount: 5,
        allCount: 10,
      },
      {
        courseName: 'Jazz Intermediate',
        hasStarted: false,
        instructorsNames: ['Alice Smith'],
        attendedCount: 0,
        allCount: 10,
      },
      {
        courseName: 'Hip Hop Advanced',
        hasStarted: true,
        instructorsNames: ['Bob Johnson'],
        attendedCount: 8,
        allCount: 12,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);

    expect(result).toHaveLength(2);
    expect(result[0]?.primaryText).toBe('Ballet Fundamentals');
    expect(result[1]?.primaryText).toBe('Hip Hop Advanced');
  });

  test('handles empty array', () => {
    const result = transformCourseAttendanceToProgressItems([]);
    expect(result).toHaveLength(0);
  });

  test('handles all courses not started', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: false,
        instructorsNames: ['John Doe'],
        attendedCount: 0,
        allCount: 10,
      },
      {
        courseName: 'Jazz Intermediate',
        hasStarted: false,
        instructorsNames: ['Alice Smith'],
        attendedCount: 0,
        allCount: 10,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);
    expect(result).toHaveLength(0);
  });

  test('handles zero attendance', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: true,
        instructorsNames: ['John Doe'],
        attendedCount: 0,
        allCount: 10,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);

    expect(result).toHaveLength(1);
    expect(result[0]?.secondaryText).toBe('Attendance: 0/10');
  });

  test('handles full attendance', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: true,
        instructorsNames: ['John Doe'],
        attendedCount: 10,
        allCount: 10,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);

    expect(result).toHaveLength(1);
    expect(result[0]?.secondaryText).toBe('Attendance: 10/10');
  });

  test('handles courses with empty instructor names array', () => {
    const courses = [
      {
        courseName: 'Ballet Fundamentals',
        hasStarted: true,
        instructorsNames: [] as string[],
        attendedCount: 5,
        allCount: 10,
      },
    ] as CourseAttendanceRate[];

    const result = transformCourseAttendanceToProgressItems(courses);

    expect(result).toHaveLength(1);
    expect(result[0]?.tertiaryText).toBe('Instructor: ');
  });
});

describe('transformMasteredCategoriesToProgressItems', () => {
  test('transforms array of mastered dance categories to progress items format (with one or more instructors)', () => {
    const mastered = [
      {
        danceCategoryName: 'Ballet',
        advancementLevelName: 'Intermediate',
        finishedDate: '2024-01-15T00:00:00.000Z',
        instructorsNames: ['John Doe', 'Alice Smith'],
      },
      {
        danceCategoryName: 'Jazz',
        advancementLevelName: 'Advanced',
        finishedDate: '2024-02-20T00:00:00.000Z',
        instructorsNames: ['Bob Johnson'],
      },
    ] as MasteredDanceCategory[];

    const result = transformMasteredCategoriesToProgressItems(mastered);

    expect(result).toHaveLength(2);
    expect(result[0]?.primaryText).toBe('Ballet, Intermediate');
    expect(result[0]?.secondaryText).toBe('Mastered 1/15/2024');
    expect(result[0]?.tertiaryText).toBe('Instructor: John Doe, Alice Smith');
    expect(result[1]?.primaryText).toBe('Jazz, Advanced');
    expect(result[1]?.secondaryText).toBe('Mastered 2/20/2024');
    expect(result[1]?.tertiaryText).toBe('Instructor: Bob Johnson');
  });

  test('handles empty array', () => {
    const result = transformMasteredCategoriesToProgressItems([]);
    expect(result).toHaveLength(0);
  });

  test('handles single item', () => {
    const mastered = [
      {
        danceCategoryName: 'Ballet',
        advancementLevelName: 'Intermediate',
        finishedDate: '2024-01-15T00:00:00.000Z',
        instructorsNames: ['John Doe'],
      },
    ] as MasteredDanceCategory[];

    const result = transformMasteredCategoriesToProgressItems(mastered);

    expect(result).toHaveLength(1);
    expect(result[0]?.primaryText).toBe('Ballet, Intermediate');
    expect(result[0]?.secondaryText).toBe('Mastered 1/15/2024');
    expect(result[0]?.tertiaryText).toBe('Instructor: John Doe');
  });

  test('formats dates correctly', () => {
    const mastered = [
      {
        danceCategoryName: 'Ballet',
        advancementLevelName: 'Intermediate',
        finishedDate: '2023-12-25T00:00:00.000Z',
        instructorsNames: ['John Doe'],
      },
      {
        danceCategoryName: 'Jazz',
        advancementLevelName: 'Advanced',
        finishedDate: '2024-06-01T00:00:00.000Z',
        instructorsNames: ['Alice Smith'],
      },
    ] as MasteredDanceCategory[];

    const result = transformMasteredCategoriesToProgressItems(mastered);

    expect(result).toHaveLength(2);
    expect(result[0]?.secondaryText).toBe('Mastered 12/25/2023');
    expect(result[1]?.secondaryText).toBe('Mastered 6/1/2024');
  });

  test('handles empty instructor names array', () => {
    const mastered = [
      {
        danceCategoryName: 'Ballet',
        advancementLevelName: 'Intermediate',
        finishedDate: '2024-01-15T00:00:00.000Z',
        instructorsNames: [] as string[],
      },
    ] as MasteredDanceCategory[];

    const result = transformMasteredCategoriesToProgressItems(mastered);

    expect(result).toHaveLength(1);
    expect(result[0]?.tertiaryText).toBe('Instructor: ');
  });

  test('handles special characters in category and level names', () => {
    const mastered = [
      {
        danceCategoryName: "Hip-Hop / Street Dance",
        advancementLevelName: "Level 1 (Beginner's)",
        finishedDate: '2024-01-15T00:00:00.000Z',
        instructorsNames: ['John Doe'],
      },
    ] as MasteredDanceCategory[];

    const result = transformMasteredCategoriesToProgressItems(mastered);

    expect(result).toHaveLength(1);
    expect(result[0]?.primaryText).toBe("Hip-Hop / Street Dance, Level 1 (Beginner's)");
  });
});

describe('calculateTotalHours', () => {
  test('calculates total hours from array of dance category stats', () => {
    const stats: DanceCategoryStats[] = [
      { danceCategoryName: 'Ballet', spentHours: 10 },
      { danceCategoryName: 'Jazz', spentHours: 15 },
      { danceCategoryName: 'Hip Hop', spentHours: 8 },
    ];

    const result = calculateTotalHours(stats);
    expect(result).toBe(33);
  });

  test('returns zero for empty array', () => {
    const result = calculateTotalHours([]);
    expect(result).toBe(0);
  });

  test('handles single item', () => {
    const stats: DanceCategoryStats[] = [{ danceCategoryName: 'Ballet', spentHours: 10 }];
    const result = calculateTotalHours(stats);
    expect(result).toBe(10);
  });

  test('handles zero hours', () => {
    const stats: DanceCategoryStats[] = [
      { danceCategoryName: 'Ballet', spentHours: 0 },
      { danceCategoryName: 'Jazz', spentHours: 0 },
    ];

    const result = calculateTotalHours(stats);
    expect(result).toBe(0);
  });

  test('handles decimal hours', () => {
    const stats: DanceCategoryStats[] = [
      { danceCategoryName: 'Ballet', spentHours: 10.5 },
      { danceCategoryName: 'Jazz', spentHours: 15.75 },
      { danceCategoryName: 'Hip Hop', spentHours: 8.25 },
    ];

    const result = calculateTotalHours(stats);
    expect(result).toBe(34.5);
  });
}); 