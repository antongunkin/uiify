import { defineStyle } from "../define.js";
import { field } from "./field.js";
import { input } from "./input.js";
import { textarea } from "./textarea.js";
import { dialog } from "./dialog.js";
import { button } from "./button.js";
import { tabs } from "./tabs.js";
import { lineChart } from "./line-chart.js";
import { badge } from "./badge.js";
import { separator } from "./separator.js";
import { fieldSeparator } from "./field-separator.js";
import { avatar } from "./avatar.js";
import { surface } from "./surface.js";
import { card } from "./card.js";
import { header } from "./header.js";
import { alert } from "./alert.js";
import { empty } from "./empty.js";
import { skeleton } from "./skeleton.js";
import { spinner } from "./spinner.js";
import { progress } from "./progress.js";
import { aspectRatio } from "./aspect-ratio.js";
import { descriptionList } from "./description-list.js";
import { item } from "./item.js";
import { breadcrumb } from "./breadcrumb.js";
import { inputGroup } from "./input-group.js";
import { fieldSet } from "./field-set.js";
import { form } from "./form.js";
import { formErrorSummary } from "./form-error-summary.js";
import { checkbox } from "./checkbox.js";
import { checkboxGroup } from "./checkbox-group.js";
import { radioGroup } from "./radio-group.js";
import { switchRecipe } from "./switch.js";
import { toggle } from "./toggle.js";
import { toggleGroup } from "./toggle-group.js";
import { segmentedControl } from "./segmented-control.js";
import { nativeSelect } from "./native-select.js";
import { slider, sliderClient } from "./slider.js";
import { rating } from "./rating.js";
import { numberField } from "./number-field.js";
import { inputOtp } from "./input-otp.js";
import { datePicker } from "./date-picker.js";
import { popover, hoverCard, tooltip } from "./popover.js";
import { pagination } from "./pagination.js";
import { menu, dropdownMenuBar } from "./menu.js";
import { colorPicker } from "./color-picker.js";
import { alertDialog } from "./alert-dialog.js";
import { toolbar } from "./toolbar.js";
import { collapsible } from "./collapsible.js";
import { fileUpload } from "./file-upload.js";
import { drawer } from "./drawer.js";
import { toast } from "./toast.js";
import { tagsInput } from "./tags-input.js";
import { accordion } from "./accordion.js";
import { table } from "./table.js";
import { tableOfContents } from "./table-of-contents.js";
import { combobox } from "./combobox.js";
import { carousel } from "./carousel.js";
import { candleChart, virtualScroll } from "./candle-chart.js";

/** The default UIify style. Each component family adds its recipe here as it migrates. */
export const uiify = defineStyle("uiify", [
  button,
  field,
  input,
  textarea,
  dialog,
  tabs,
  lineChart,
  badge,
  separator,
  fieldSeparator,
  avatar,
  surface,
  card,
  header,
  alert,
  empty,
  skeleton,
  spinner,
  progress,
  aspectRatio,
  descriptionList,
  item,
  breadcrumb,
  inputGroup,
  fieldSet,
  form,
  formErrorSummary,
  checkbox,
  checkboxGroup,
  radioGroup,
  switchRecipe,
  toggle,
  toggleGroup,
  segmentedControl,
  nativeSelect,
  slider,
  sliderClient,
  rating,
  numberField,
  inputOtp,
  datePicker,
  popover,
  hoverCard,
  tooltip,
  pagination,
  menu,
  dropdownMenuBar,
  colorPicker,
  alertDialog,
  toolbar,
  collapsible,
  fileUpload,
  drawer,
  toast,
  tagsInput,
  accordion,
  table,
  tableOfContents,
  combobox,
  carousel,
  virtualScroll,
  candleChart,
]);
