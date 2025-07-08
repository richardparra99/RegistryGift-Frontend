type CardProps = {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Card = ({ title, children, onClick, className }: CardProps) => {
  return (
    <div
      className={`rounded-xl overflow-hidden bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer ${className ?? ''}`}
      onClick={onClick}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
      )}
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};
