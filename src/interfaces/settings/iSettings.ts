import {PressureType, ScaleType} from './../../classes/devices';
/** Interfaces */
/** Enums */
import {BREW_VIEW_ENUM} from '../../enums/settings/brewView';
import {IConfig} from '../objectConfig/iObjectConfig';
import {IBrewParameter} from '../parameter/iBrewParameter';
import {STARTUP_VIEW_ENUM} from '../../enums/settings/startupView';
import {IOrderBrewParameter} from '../parameter/iOrderBrewParameter';
import {IBrewPageFilter} from '../brew/iBrewPageFilter';
import {IBeanPageSort} from '../bean/iBeanPageSort';
import {ListViewBrewParameter} from '../../classes/parameter/listViewBrewParameter';
import {IBeanPageFilter} from '../bean/iBeanPageFilter';
import {IBrewGraphs} from '../brew/iBrewGraphs';

export interface ISettings {
 // Properties
  brew_view: BREW_VIEW_ENUM;
  startup_view: STARTUP_VIEW_ENUM;

  language: string;
  manage_parameters: IBrewParameter;
  default_last_coffee_parameters: IBrewParameter;
  visible_list_view_parameters: IBrewParameter;
  brew_order: IOrderBrewParameter;
  matomo_analytics: boolean;
  qr_scanner_information: boolean;
  track_brew_coordinates: boolean;
  fast_brew_repeat: boolean;
  image_quality: number;
  brew_rating: number;
  brew_rating_steps: number;
  show_archived_brews_on_dashboard: boolean;

  show_archived_beans: boolean;
  show_archived_brews: boolean;
  show_archived_mills: boolean;
  show_archived_preparations: boolean;
  show_archived_green_beans: boolean;
  show_archived_waters: boolean;

  track_caffeine_consumption: boolean;

  show_roasting_section: boolean;
  show_water_section: boolean;
  show_cupping_section: boolean;

  brew_filter: {
    OPEN: IBrewPageFilter,
    ARCHIVED: IBrewPageFilter
  };

  bean_filter: {
    OPEN: IBeanPageFilter,
    ARCHIVED: IBeanPageFilter
  };


  bean_sort: {
    OPEN: IBeanPageSort,
    ARCHIVED: IBeanPageSort
  };

  green_bean_sort: {
    OPEN: IBeanPageSort,
    ARCHIVED: IBeanPageSort
  };

  graph: {
    ESPRESSO: IBrewGraphs,
    FILTER: IBrewGraphs,
  };

  welcome_page_showed: boolean;

  wake_lock: boolean;

  config: IConfig;

  scale_id: string;
  scale_type: ScaleType;
  scale_log: boolean;
  bluetooth_scale_stay_connected: boolean;
  bluetooth_scale_tare_on_brew: boolean;
  bluetooth_scale_tare_on_start_timer: boolean;
  bluetooth_scale_reset_timer_on_brew: boolean;
  bluetooth_scale_stop_timer_on_brew: boolean;
  bluetooth_ignore_negative_values: boolean;
  bluetooth_ignore_anomaly_values: boolean;


  pressure_id: string;
  pressure_type: PressureType;
  pressure_log: boolean;
  pressure_threshold_active: boolean;
  pressure_threshold_bar: number;

  currency: string;
}
