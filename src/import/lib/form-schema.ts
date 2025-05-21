import { z } from "zod";

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export type ImportFormSchemaType = z.infer<typeof importFormSchema>;

export const importFormSchema = z
  .object({
    userProfile: z
      .string()
      .max(15000, {
        message: "Profile/CV text must be at most 15000 characters.",
      })
      .optional(),
    userProfilePdf: z
      .any()
      .optional()
      .refine((files) => {
        // Check if FileList is defined (browser environment) before using it
        if (
          typeof FileList === "undefined" ||
          !files ||
          !(files instanceof FileList) ||
          files.length === 0
        )
          return true;
        return files[0].size <= MAX_FILE_SIZE_BYTES;
      }, `Max file size is ${MAX_FILE_SIZE_MB}MB.`)
      .refine((files) => {
        // Check if FileList is defined (browser environment) before using it
        if (
          typeof FileList === "undefined" ||
          !files ||
          !(files instanceof FileList) ||
          files.length === 0
        )
          return true;
        return files[0].type === "application/pdf";
      }, "Only PDF files are allowed."),
  })
  .superRefine((data, ctx) => {
    // Check if FileList is defined before trying to access properties of files
    const pdfFileProvided =
      typeof FileList !== "undefined" &&
      data.userProfilePdf &&
      data.userProfilePdf instanceof FileList &&
      data.userProfilePdf.length > 0;

    if (!data.userProfile && !pdfFileProvided) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Profile/CV text or a PDF upload is required.",
        path: ["userProfile"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Profile/CV text or a PDF upload is required.",
        path: ["userProfilePdf"],
      });
    }
    if (
      data.userProfile &&
      data.userProfile.length > 0 &&
      data.userProfile.length < 50 &&
      !pdfFileProvided
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 50,
        type: "string",
        inclusive: true,
        message:
          "Profile/CV text must be at least 50 characters if no PDF is uploaded.",
        path: ["userProfile"],
      });
    }
  });
