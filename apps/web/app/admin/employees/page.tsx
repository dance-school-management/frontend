import { headers } from "next/headers";

import { EmployeesTable } from "@/components/employees-table";
import { PaginationControls } from "@/components/utility/pagination";
import { authClient } from "@/lib/model";
import { UserRole } from "@/lib/model/auth";

const roles = ["admin", "COORDINATOR", "INSTRUCTOR"] as const;

interface EmployeesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: EmployeesPageProps) {
  const { page } = await searchParams;

  const pageNumber = page ? parseInt(page, 10) : 1;
  const limit = 5 as const;
  const offset = (pageNumber - 1) * limit;

  const roleResponses = await Promise.all(
    roles.map(async (role) => {
      return authClient.admin.listUsers({
        query: {
          limit,
          offset,
          filterField: "role",
          filterOperator: "eq",
          filterValue: role,
        },
        fetchOptions: {
          headers: await headers(),
        },
      });
    }),
  );

  const employees = roleResponses.flatMap((response) => {
    const users = response.data?.users ?? [];
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
    }));
  });

  const total = roleResponses.reduce((sum, response) => {
    return sum + (response.data?.total ?? 0);
  }, 0);

  const maxUsers = roleResponses.reduce((max, response) => {
    return Math.max(max, response.data?.total ?? 0);
  }, 0);

  const totalPages = Math.ceil(maxUsers / limit);

  const getPageUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", pageNum.toString());
    return `?${searchParams.toString()}`;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:py-6">
          <EmployeesTable data={employees} />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={pageNumber}
              totalPages={totalPages}
              getPageUrl={getPageUrl}
              total={total}
              className="mt-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
