import { DanceCategoryStats, InstructorStats, CourseAttendanceRate, MasteredDanceCategory } from "@/lib/model/enroll";

/**
 * Transforms DanceCategoryStats array to chart data format
 * @param stats Array of dance category statistics
 * @returns Array of chart data objects with name and value properties
 */
export function transformDanceCategoryStatsToChartData(stats: DanceCategoryStats[]) {
  return stats.map(stat => ({
    name: stat.danceCategoryName,
    value: stat.spentHours
  }));
}

/**
 * Transforms InstructorStats array to chart data format
 * @param stats Array of instructor statistics
 * @returns Array of chart data objects with name and value properties
 */
export function transformInstructorStatsToChartData(stats: InstructorStats[]) {
  return stats.map(stat => ({
    name: `${stat.instructorFirstname} ${stat.instructorSurname}`,
    value: stat.spentHours
  }));
}

/**
 * Transforms CourseAttendanceRate array to progress items format
 * @param courses Array of course attendance rates
 * @returns Array of progress item objects with primaryText, secondaryText, and tertiaryText
 */
export function transformCourseAttendanceToProgressItems(courses: CourseAttendanceRate[]) {
  return courses
    .filter(course => course.hasStarted) // Only show ongoing courses
    .map(course => ({
      primaryText: course.courseName,
      secondaryText: `Attendance: ${course.attendedCount}/${course.allCount}`,
      tertiaryText: `Instructor: ${course.instructorsNames.join(", ")}`
    }));
}

/**
 * Transforms MasteredDanceCategory array to progress items format
 * @param mastered Array of mastered dance categories
 * @returns Array of progress item objects with primaryText, secondaryText, and tertiaryText
 */
export function transformMasteredCategoriesToProgressItems(mastered: MasteredDanceCategory[]) {
  return mastered.map(category => ({
    primaryText: `${category.danceCategoryName}, ${category.advancementLevelName}`,
    secondaryText: `Mastered ${new Date(category.finishedDate).toLocaleDateString()}`,
    tertiaryText: `Instructor: ${category.instructorsNames.join(", ")}`
  }));
}

/**
 * Calculates total hours from DanceCategoryStats array
 * @param stats Array of dance category statistics
 * @returns Total number of hours spent across all categories
 */
export function calculateTotalHours(stats: DanceCategoryStats[]): number {
  return stats.reduce((total, stat) => total + stat.spentHours, 0);
}

/**
 * Type definitions for the transformed data structures
 */
export type ChartData = {
  name: string;
  value: number;
};

export type ProgressItemData = {
  primaryText: string;
  secondaryText: string;
  tertiaryText: string;
};
