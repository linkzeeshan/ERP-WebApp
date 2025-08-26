interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className="mt-1 text-sm text-red-600">
      {message}
    </div>
  );
}

export function FormFieldError({ message }: FormErrorProps) {
  if (!message) return null;
  
  return (
    <div className="mt-1 text-xs text-red-600">
      {message}
    </div>
  );
}

export function FormSuccessMessage({ message }: { message: string }) {
  if (!message) return null;
  
  return (
    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
      {message}
    </div>
  );
}
