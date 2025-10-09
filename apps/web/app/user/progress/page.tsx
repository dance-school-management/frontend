import { ProgressChart } from "@/components/progress/progress-chart";
import { ProgressItemGroup } from "@/components/progress/progress-item";
import { TotalHoursInfo } from "@/components/progress/total-hours-info";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";

import {
    transformDanceCategoryStatsToChartData,
    transformInstructorStatsToChartData,
    transformCourseAttendanceToProgressItems,
    transformMasteredCategoriesToProgressItems,
    calculateTotalHours
} from "@/lib/utils/progress-transformers";
import { fetchCourseAttendanceRate, fetchDanceCategoryStats, fetchInstructorStats, fetchMasteredDanceCategories } from "@/lib/api/enroll";

// const categoryChartData = [
//     { name: "BALLET", value: 15.2 },
//     { name: "CONTEMPORARY", value: 8.3 },
//     { name: "JAZZ", value: 12.8 },
//     { name: "HIP HOP", value: 19.5 },
//     { name: "LATIN", value: 6.7 },
// ];

// const instructorChartData = [
//     { name: "John Doe", value: 15.2 },
//     { name: "Jane Smith", value: 8.3 },
//     { name: "Jim Kelly", value: 12.8 },
//     { name: "Jill Johnson", value: 19.5 },
//     { name: "Jack Anderson", value: 6.7 },
// ];

// const ongoingCourses = [
//     { primaryText: "Ballet Mastery", secondaryText: "Attendance: 10/15", tertiaryText: "Instructor: John Doe" },
//     { primaryText: "Latin for beginners", secondaryText: "Attendance: 12/15", tertiaryText: "Instructor: Jane Smith" },
// ];

// const mastered = [
//     { primaryText: "Ballet, Advanced", secondaryText: "Mastered 29.09.2025", tertiaryText: "Instructor: John Doe" },
//     { primaryText: "Jazz, Intermediate", secondaryText: "Mastered 16.06.2025", tertiaryText: "Instructor: Jane Smith" },
// ];



export default async function Page() {
    const danceCategoryStats = await fetchDanceCategoryStats();
    const instructorStats = await fetchInstructorStats();
    const courseAttendanceRate = await fetchCourseAttendanceRate();
    const masteredDanceCategories = await fetchMasteredDanceCategories();

    const categoryChartData = transformDanceCategoryStatsToChartData(danceCategoryStats.data?.spentHoursStatsList || []);
    const instructorChartData = transformInstructorStatsToChartData(instructorStats.data?.spentHoursStatsList || []);
    const ongoingCourses = transformCourseAttendanceToProgressItems(courseAttendanceRate.data?.courseAttendancesRates || []);
    const mastered = transformMasteredCategoriesToProgressItems(masteredDanceCategories.data || []);
    const totalHours = calculateTotalHours(danceCategoryStats.data?.spentHoursStatsList || []);

    return (
        <div className="flex h-full p-4 flex-col space-y-4">
            <h1 className="text-4xl font-bold">My progress</h1>
            <div className="lg:col-span-2">
                <TotalHoursInfo hours={totalHours} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ongoing courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressItemGroup data={ongoingCourses} />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mastered dance categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressItemGroup data={mastered} />
                        </CardContent>
                    </Card>
                </div>
                {categoryChartData.length > 0 && <ProgressChart data={categoryChartData} title="Dance categories progress" />}
                {instructorChartData.length > 0 && <ProgressChart data={instructorChartData} title="Time spent with instructors" />}
            </div>
        </div>
    );
}
