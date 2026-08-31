import { AttendanceRollCall } from "@/modules/enrollment/presentation/components/attendance-roll-call";

export default function AttendancePage() {
  return (
    <div className="min-h-screen w-full bg-stone-950 p-4 md:p-8 flex items-center justify-center">
      <AttendanceRollCall />
    </div>
  );
}
