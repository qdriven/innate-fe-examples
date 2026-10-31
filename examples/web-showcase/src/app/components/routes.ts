import type { LucideIcon } from "lucide-react"
import {
  AlertCircleIcon,
  ArrowDownToLineIcon,
  ArrowLeftRightIcon,
  BellRingIcon,
  BoxIcon,
  CalendarIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsDownUpIcon,
  ChevronsLeftRightIcon,
  CircleDotIcon,
  CircleUserRoundIcon,
  Columns2Icon,
  CommandIcon,
  CompassIcon,
  CreditCardIcon,
  FileBoxIcon,
  FolderTreeIcon,
  GroupIcon,
  IdCardIcon,
  ImageIcon,
  InboxIcon,
  KeyRoundIcon,
  LineChartIcon,
  ListChecksIcon,
  LoaderCircleIcon,
  LoaderIcon,
  MenuIcon,
  MessageCircleMoreIcon,
  MessageSquareIcon,
  MinusIcon,
  MousePointerClickIcon,
  OctagonAlertIcon,
  PanelLeftIcon,
  PanelTopIcon,
  PanelsTopLeftIcon,
  RatioIcon,
  ScrollIcon,
  SlidersHorizontalIcon,
  SquareIcon,
  TableIcon,
  TagIcon,
  TextCursorInputIcon,
  TextIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from "lucide-react"

export const COMPONENT_CATEGORIES = [
  "layout",
  "navigation",
  "forms",
  "actions",
  "feedback",
  "overlay",
  "data",
] as const

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]

export interface ComponentRoute {
  /** URL slug — must match the key used in the dynamic route lookup map. */
  slug: string
  /** Human-readable display name shown in cards & headings. */
  name: string
  /** Short marketing-style summary (1 line). */
  description: string
  /** Category for grouping on the homepage overview and sidebar. */
  category: ComponentCategory
  /** lucide-react icon for the overview card and sidebar entry. */
  icon: LucideIcon
  /**
   * Sidebar order within `category` — lower numbers appear first.
   * Omit to keep declaration order in `componentRoutes`.
   */
  order?: number
}

export const componentRoutes: ComponentRoute[] = [
  // ── Layout & structure ───────────────────────────────────────────────────
  {
    slug: "card",
    name: "Card",
    description:
      "Surface container — header/content/footer anatomy plus a login example.",
    category: "layout",
    icon: CreditCardIcon,
  },
  {
    slug: "separator",
    name: "Separator",
    description:
      "Visual divider — horizontal, vertical, and with inline text label.",
    category: "layout",
    icon: MinusIcon,
  },
  {
    slug: "resizable",
    name: "Resizable",
    description:
      "Split panes — horizontal and vertical, with handle and persisted size.",
    category: "layout",
    icon: Columns2Icon,
  },
  {
    slug: "scroll-area",
    name: "ScrollArea",
    description:
      "Constrained scroll region — vertical, horizontal, and both axes.",
    category: "layout",
    icon: ScrollIcon,
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description:
      "App shell nav — collapsible sidebar provider with mobile sheet fallback.",
    category: "layout",
    icon: PanelLeftIcon,
  },
  {
    slug: "aspect-ratio",
    name: "AspectRatio",
    description:
      "Fixed-ratio media wrapper — 16:9, 4:3, and 1:1 with overflow-hidden child.",
    category: "layout",
    icon: RatioIcon,
  },
  {
    slug: "direction",
    name: "Direction",
    description: "RTL/LTR provider — DirectionProvider with useDirection hook.",
    category: "layout",
    icon: ArrowLeftRightIcon,
  },

  // ── Navigation ───────────────────────────────────────────────────────────
  {
    slug: "tabs",
    name: "Tabs",
    description:
      "Switch between panels — horizontal default and vertical orientation.",
    category: "navigation",
    icon: FolderTreeIcon,
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description:
      "Hierarchy trail — Home / Section / Page with custom separator and ellipsis.",
    category: "navigation",
    icon: ChevronRightIcon,
  },
  {
    slug: "pagination",
    name: "Pagination",
    description:
      "Paged navigation — page numbers, previous/next, ellipsis, and goto input.",
    category: "navigation",
    icon: ChevronsLeftRightIcon,
  },
  {
    slug: "menubar",
    name: "Menubar",
    description:
      "Menu bar — File / Edit / View triggers with nested dropdown content.",
    category: "navigation",
    icon: MenuIcon,
  },
  {
    slug: "navigation-menu",
    name: "NavigationMenu",
    description: "Mega-menu nav — top triggers that open rich content panels.",
    category: "navigation",
    icon: CompassIcon,
  },
  {
    slug: "command",
    name: "Command",
    description: "Command palette — searchable list with keyboard navigation.",
    category: "navigation",
    icon: CommandIcon,
  },
  {
    slug: "carousel",
    name: "Carousel",
    description:
      "Slideshow — embla-based loop with previous/next and dot indicators.",
    category: "navigation",
    icon: ImageIcon,
  },

  // ── Forms & input ────────────────────────────────────────────────────────
  {
    slug: "input",
    name: "Input",
    description:
      "Text, file, disabled, and invalid inputs with prefix and suffix icons.",
    category: "forms",
    icon: TextCursorInputIcon,
  },
  {
    slug: "input-group",
    name: "InputGroup",
    description:
      "Grouped input with leading/trailing icons, labels, and inline buttons.",
    category: "forms",
    icon: GroupIcon,
  },
  {
    slug: "input-otp",
    name: "InputOTP",
    description:
      "One-time code input — 4, 6, and grouped slots with separator.",
    category: "forms",
    icon: KeyRoundIcon,
  },
  {
    slug: "select",
    name: "Select",
    description:
      "Single-select dropdown — placeholder, selected, disabled, and grouped items.",
    category: "forms",
    icon: ChevronDownIcon,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description:
      "Boolean check — checked, unchecked, indeterminate, and disabled states.",
    category: "forms",
    icon: CheckSquareIcon,
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    description:
      "Mutually exclusive choice — vertical list and horizontal card style.",
    category: "forms",
    icon: CircleDotIcon,
  },
  {
    slug: "switch",
    name: "Switch",
    description: "Binary toggle — on, off, disabled, with inline label slot.",
    category: "forms",
    icon: ToggleLeftIcon,
  },
  {
    slug: "slider",
    name: "Slider",
    description:
      "Range input — single, range, step, with value label and disabled.",
    category: "forms",
    icon: SlidersHorizontalIcon,
  },
  {
    slug: "calendar",
    name: "Calendar",
    description:
      "Date picker — single date and date range with footer actions.",
    category: "forms",
    icon: CalendarIcon,
  },
  {
    slug: "form",
    name: "Form",
    description:
      "react-hook-form scaffolding — Field, FormItem, FormLabel, FormControl, FormMessage.",
    category: "forms",
    icon: ListChecksIcon,
  },
  {
    slug: "field",
    name: "Field",
    description:
      "Form field layout — label, control, description, and error in horizontal/vertical orientation.",
    category: "forms",
    icon: FileBoxIcon,
  },
  {
    slug: "label",
    name: "Label",
    description:
      "Form label — paired with control via htmlFor, supports disabled state.",
    category: "forms",
    icon: TagIcon,
  },
  {
    slug: "textarea",
    name: "Textarea",
    description:
      "Multi-line text — basic, with character count, disabled, and invalid.",
    category: "forms",
    icon: TextIcon,
  },

  // ── Actions ──────────────────────────────────────────────────────────────
  {
    slug: "button",
    name: "Button",
    description:
      "Primary action primitive — 6 variants and 7 sizes with icon support.",
    category: "actions",
    icon: SquareIcon,
  },
  {
    slug: "button-group",
    name: "ButtonGroup",
    description:
      "Group of buttons — horizontal and vertical with shared border radius.",
    category: "actions",
    icon: GroupIcon,
  },
  {
    slug: "toggle",
    name: "Toggle",
    description:
      "Pressed-state button — default, outline, with sizes and disabled.",
    category: "actions",
    icon: ToggleRightIcon,
  },
  {
    slug: "toggle-group",
    name: "ToggleGroup",
    description:
      "Single or multiple pressed-state buttons — outline, single, spacing.",
    category: "actions",
    icon: BoxIcon,
  },

  // ── Feedback ─────────────────────────────────────────────────────────────
  {
    slug: "alert",
    name: "Alert",
    description:
      "Inline alert — info, success, warning, and error with title and description.",
    category: "feedback",
    icon: AlertCircleIcon,
  },
  {
    slug: "sonner",
    name: "Sonner (Toast)",
    description:
      "Stacking toast notifications — success, info, warning, and error variants.",
    category: "feedback",
    icon: BellRingIcon,
  },
  {
    slug: "progress",
    name: "Progress",
    description:
      "Linear progress bar — determinate and indeterminate with sizes.",
    category: "feedback",
    icon: LineChartIcon,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description:
      "Loading placeholder — text line, circle, and card with pulse animation.",
    category: "feedback",
    icon: LoaderIcon,
  },
  {
    slug: "spinner",
    name: "Spinner",
    description:
      "Spinning indicator — sizes, colors, and decorative vs accessible roles.",
    category: "feedback",
    icon: LoaderCircleIcon,
  },
  {
    slug: "empty",
    name: "Empty",
    description:
      "Empty state placeholder — icon, title, description, and action slot.",
    category: "feedback",
    icon: InboxIcon,
  },
  {
    slug: "kbd",
    name: "Kbd",
    description:
      "Keyboard hint — single key and combo with separator (e.g. ⌘ K).",
    category: "feedback",
    icon: CommandIcon,
  },

  // ── Overlays ─────────────────────────────────────────────────────────────
  {
    slug: "dialog",
    name: "Dialog",
    description: "Modal dialog — basic confirmation and a form-style example.",
    category: "overlay",
    icon: PanelTopIcon,
  },
  {
    slug: "alert-dialog",
    name: "AlertDialog",
    description:
      "Modal confirmation — destructive action with cancel and continue.",
    category: "overlay",
    icon: OctagonAlertIcon,
  },
  {
    slug: "sheet",
    name: "Sheet",
    description:
      "Side panel — left, right, top, and bottom with custom close button.",
    category: "overlay",
    icon: PanelsTopLeftIcon,
  },
  {
    slug: "drawer",
    name: "Drawer",
    description:
      "Bottom drawer (vaul) — drag handle, snap points, and dismissible.",
    category: "overlay",
    icon: ArrowDownToLineIcon,
  },
  {
    slug: "popover",
    name: "Popover",
    description:
      "Click-triggered popover — basic, with form, and controlled state.",
    category: "overlay",
    icon: MessageSquareIcon,
  },
  {
    slug: "hover-card",
    name: "HoverCard",
    description: "Hover-triggered rich popover — user card on avatar hover.",
    category: "overlay",
    icon: IdCardIcon,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "Hover info popover — on Button, on disabled Button, and on Kbd.",
    category: "overlay",
    icon: MessageCircleMoreIcon,
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    description:
      "Action menu — items, checkbox items, radio items, separators, and shortcuts.",
    category: "overlay",
    icon: ChevronDownIcon,
  },
  {
    slug: "context-menu",
    name: "ContextMenu",
    description:
      "Right-click menu — same API as DropdownMenu, triggered on contextmenu.",
    category: "overlay",
    icon: MousePointerClickIcon,
  },
  {
    slug: "accordion",
    name: "Accordion",
    description:
      "Stacked collapsible sections — single and multiple open modes.",
    category: "overlay",
    icon: ChevronsDownUpIcon,
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description:
      "Expand/collapse region — controlled and uncontrolled triggers.",
    category: "overlay",
    icon: ChevronDownIcon,
  },

  // ── Data display ─────────────────────────────────────────────────────────
  {
    slug: "avatar",
    name: "Avatar",
    description:
      "User identity — image, fallback initials, sizes, and group stack.",
    category: "data",
    icon: CircleUserRoundIcon,
  },
  {
    slug: "badge",
    name: "Badge",
    description:
      "Compact label — 7 variants for status, count, and tag use cases.",
    category: "data",
    icon: TagIcon,
  },
  {
    slug: "item",
    name: "Item",
    description:
      "List item — avatar + title + description + actions in a single row.",
    category: "data",
    icon: InboxIcon,
  },
  {
    slug: "table",
    name: "Table",
    description:
      "Data table — 5 rows × 4 columns with header, body, caption, and footer.",
    category: "data",
    icon: TableIcon,
  },
  {
    slug: "chart",
    name: "Chart",
    description:
      "Recharts wrapper — ChartContainer with tooltip and legend theming.",
    category: "data",
    icon: LineChartIcon,
  },
]

/** O(1)-ish lookup helper used by the dynamic route and the 404 check. */
export function getRouteBySlug(slug: string): ComponentRoute | undefined {
  return componentRoutes.find((r) => r.slug === slug)
}
