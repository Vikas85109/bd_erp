export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="skeleton h-4 w-1/3 rounded-lg" />
      <div className="skeleton mt-4 h-8 w-1/2 rounded-lg" />
      <div className="skeleton mt-4 h-3 w-2/3 rounded-lg" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div>
            <div className="skeleton h-4 w-32 rounded-lg" />
            <div className="skeleton mt-1 h-3 w-24 rounded-lg" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4"><div className="skeleton h-6 w-16 rounded-full" /></td>
      <td className="px-6 py-4"><div className="skeleton h-6 w-20 rounded-full" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-16 rounded-lg" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-24 rounded-lg" /></td>
      <td className="px-6 py-4"><div className="skeleton h-4 w-20 rounded-lg" /></td>
    </tr>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <div className="skeleton h-16 w-64 rounded-2xl rounded-bl-md" />
      </div>
      <div className="flex justify-end">
        <div className="skeleton h-12 w-48 rounded-2xl rounded-br-md" />
      </div>
      <div className="flex justify-start">
        <div className="skeleton h-20 w-72 rounded-2xl rounded-bl-md" />
      </div>
    </div>
  );
}
