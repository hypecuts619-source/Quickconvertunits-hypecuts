import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  category: { id: string, name: string };
  unitFrom?: { name: string };
  unitTo?: { name: string };
  isSpecificConverter: boolean;
}

export function Breadcrumbs({ category, unitFrom, unitTo, isSpecificConverter }: BreadcrumbsProps) {
  const { t } = useTranslation();

  return (
    <nav className="flex items-center text-sm font-medium text-neutral-500 overflow-x-auto whitespace-nowrap mb-6" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      <ChevronRight className="w-4 h-4 mx-1 opacity-50 shrink-0" />
      
      {isSpecificConverter ? (
        <>
          <Link 
            to={`/${category.id.replace(/_/g, '-')}-converter`}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {category.name}
          </Link>
          <ChevronRight className="w-4 h-4 mx-1 opacity-50 shrink-0" />
          <span className="text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {unitFrom?.name} to {unitTo?.name}
          </span>
        </>
      ) : (
        <span className="text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          {category.name}
        </span>
      )}
    </nav>
  );
}
