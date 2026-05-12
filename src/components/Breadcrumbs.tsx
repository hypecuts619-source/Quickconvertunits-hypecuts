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
    <nav className="flex items-center text-sm font-medium text-neutral-500 overflow-x-auto whitespace-nowrap mb-6" aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
      <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1" itemProp="item">
          <Home className="w-4 h-4" />
          <span itemProp="name">Home</span>
        </Link>
        <meta itemProp="position" content="1" />
      </div>
      
      <ChevronRight className="w-4 h-4 mx-1 opacity-50 shrink-0" />
      
      {isSpecificConverter ? (
        <>
          <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link 
              to={`/${category.id.replace(/_/g, '-')}-converter`}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{category.name}</span>
            </Link>
            <meta itemProp="position" content="2" />
          </div>
          <ChevronRight className="w-4 h-4 mx-1 opacity-50 shrink-0" />
          <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800" itemProp="item">
              <span itemProp="name">{unitFrom?.name} to {unitTo?.name}</span>
            </span>
            <meta itemProp="position" content="3" />
          </div>
        </>
      ) : (
        <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span className="text-neutral-900 dark:text-neutral-100 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800" itemProp="item">
            <span itemProp="name">{category.name}</span>
          </span>
          <meta itemProp="position" content="2" />
        </div>
      )}
    </nav>
  );
}
