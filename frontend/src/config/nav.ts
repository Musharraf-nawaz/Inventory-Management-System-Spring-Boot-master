import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Warehouse,
  Truck,
  Tags,
  FileText,
  Link2,
  ClipboardList,
  Users,
  Shield,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/stock', label: 'Stock', icon: Warehouse },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/pricing', label: 'Pricing', icon: Tags },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/product-pricing', label: 'Product pricing', icon: Link2 },
  { to: '/product-invoices', label: 'Product invoices', icon: ClipboardList },
];

export const adminNav: NavItem[] = [
  { to: '/users', label: 'Users', icon: Users },
  { to: '/roles', label: 'Roles', icon: Shield },
];
