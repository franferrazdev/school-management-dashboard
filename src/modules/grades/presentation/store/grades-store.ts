import { create } from "zustand";
import { AcademicPeriod } from "../../domain/entities/grade";
import fa from "zod/v4/locales/fa.cjs";

interface GradeState {
  selectedClassId: string | null;
  selectedPeriod: AcademicPeriod;
  isFilterActive: boolean;
  setSelectedClassId: (classId: string | null) => void;
  setSelectedPeriod: (period: AcademicPeriod) => void;
  resetFilters: () => void;
}

export const useGradesStore = create<GradeState>((set) => ({
  selectedClassId: null,
  selectedPeriod: "BIMESTRE_1",
  isFilterActive: false,

  setSelectedClassId: (classId) =>
    set((state) => ({
      selectedClassId: classId,
      isFilterActive: classId !== null,
    })),

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  resetFilters: () =>
    set({
      selectedClassId: null,
      selectedPeriod: "BIMESTRE_1",
      isFilterActive: false,
    }),
}));
