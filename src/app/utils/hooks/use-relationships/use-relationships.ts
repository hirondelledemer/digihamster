"use client";
import { useCallback } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { api, FieldsRequired } from "./api";
import { IRelationship } from "../../types/relationship";
import { getApiErrorMessage } from "../../axios";

export const useRelationships = () => {
  const { toast } = useToast();

  const createRelationship = useCallback(
    async (data: FieldsRequired): Promise<IRelationship | null> => {
      try {
        const response = await api.create(data);
        return response.data;
      } catch (e: unknown) {
        // relationships are created alongside another entity, so the caller
        // already reported its own success — only the failure needs surfacing
        toast({
          title: "Error",
          description: getApiErrorMessage(e),
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  return { create: createRelationship };
};
