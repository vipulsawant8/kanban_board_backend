import { z } from "zod";
import { Types } from "mongoose";
import ERRORS from "../constants/errors.js";

/* ---------------- HELPERS ---------------- */

const objectIdSchema = (errorMessage) =>
  z.string().refine(
    (val) => Types.ObjectId.isValid(val),
    { message: errorMessage }
  );

const titleSchema = z
  .string()
  .trim()
  .min(1, { message: ERRORS.TASK_TITLE_REQUIRED });

const descriptionSchema = z
  .string()
  .trim()
  .optional();

const positionSchema = z
  .number({
    invalid_type_error: ERRORS.TASK_POSITION_INVALID,
  })
  .int({ message: ERRORS.TASK_POSITION_INVALID })
  .nonnegative({ message: ERRORS.TASK_POSITION_INVALID });

/* ---------------- CREATE TASK ---------------- */

export const createTaskSchema = {
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
    listID: objectIdSchema(ERRORS.TASK_LIST_NOT_IDENTIFIED),
  }).strict(),
};


/* ---------------- UPDATE TASK ---------------- */

export const updateTaskSchema = {
  params: z.object({
    id: objectIdSchema(ERRORS.TASK_NOT_IDENTIFIED),
  }),
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
  }).strict(),
};


/* ---------------- DELETE TASK ---------------- */

export const deleteTaskSchema = {
  params: z.object({
    id: objectIdSchema(ERRORS.TASK_NOT_IDENTIFIED),
  }),
};


/* ---------------- REORDER TASKS ---------------- */

export const reorderTasksSchema = {
  body: z.object({
    tasksOrder: z
      .array(
        z.object({
          _id: objectIdSchema(ERRORS.TASK_NOT_IDENTIFIED),
          listID: objectIdSchema(ERRORS.TASK_LIST_NOT_IDENTIFIED),
          position: positionSchema,
        })
      )
      .min(1, { message: ERRORS.TASK_REORDER_EMPTY }),
  }).strict(),
};