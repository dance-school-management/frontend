"use client";

import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClassOrder, createCourseOrder } from "@/lib/api/enroll";

type PaymentMode = "course" | "class";

interface PaymentCTAProps {
  mode: PaymentMode;
  priceLabel: string;
  courseId?: number;
  classId?: number;
}

export function PaymentCTA({ mode, priceLabel, courseId, classId }: PaymentCTAProps) {
  const router = useRouter();

  if (mode === "course" && !courseId) {
    return null;
  }
  if (mode === "class" && !classId) {
    return null;
  }

  async function handleCoursePayment(courseId: number) {
    const result = await createCourseOrder(courseId);
    if (result.error || !result.data || !result.data.sessionUrl) {
      toast.error(result?.error?.message ?? "Failed to create course order");
      return;
    }
    if (result.data && result.data.sessionUrl) {
      router.push(result.data.sessionUrl);
    }
  }

  async function handleClassPayment(classId: number) {
    const result = await createClassOrder(classId);
    if (result.error || !result.data || !result.data.sessionUrl) {
      toast.error(result?.error?.message ?? "Failed to create class order");
      return;
    }
    if (result.data && result.data.sessionUrl) {
      router.push(result.data.sessionUrl);
    }
  }

  const handleClick = () => {
    if (mode === "course") {
      handleCoursePayment(courseId!);
    } else if (mode === "class") {
      handleClassPayment(classId!);
    } else {
      throw new Error(`Invalid mode: ${mode}`);
    }
  };

  return (
    <Button className="w-full mt-4 bg-green-500 hover:bg-green-600" onClick={handleClick}>
      Proceed to payment ({priceLabel})
    </Button>
  );
}
