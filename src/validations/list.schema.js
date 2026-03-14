import { z } from "zod";
import { Types } from "mongoose";
import ERRORS from "../constants/errors.js";

/* ---------- Helpers ---------- */

const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: ERRORS.LIST_NOT_IDENTIFIED }
);

/* ---------- Create List ---------- */

export const createListSchema = {
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: ERRORS.LIST_TITLE_REQUIRED }),
  }),
};

/* ---------- Update List ---------- */

export const updateListSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: ERRORS.LIST_TITLE_REQUIRED }),
  }),
};

/* ---------- Delete List ---------- */

export const deleteListSchema = {
  params: z.object({
    id: objectIdSchema,
  }),
};

/* ---------- Reorder Lists ---------- */

export const reorderListsSchema = {
  body: z.object({
    listsOrder: z
      .array(
        z.object({
          _id: objectIdSchema,
          position: z
            .number({
              invalid_type_error: ERRORS.LIST_POSITION_INVALID,
            })
            .int({ message: ERRORS.LIST_POSITION_INVALID })
            .nonnegative({ message: ERRORS.LIST_POSITION_INVALID }),
        })
      )
      .min(1, { message: ERRORS.LIST_REORDER_EMPTY }),
  }),
};