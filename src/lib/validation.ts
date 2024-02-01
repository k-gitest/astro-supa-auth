import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export function validateFormData(data: Record<string, unknown>) {
  try {
    formSchema.parse(data);
    return null; 
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((validationError) => {
        return {
          message: validationError.message,
          path: validationError.path.join('.'),
        };
      });
      
      return formattedErrors;
    }
  }
}
