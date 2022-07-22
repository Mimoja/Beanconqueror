import { Injectable } from '@angular/core';

import {UIStorage} from '../uiStorage';
import {UIFileHelper} from '../uiFileHelper';
import {UILog} from '../uiLog';
import {EventQueueService} from '../queueService/queue-service.service';
import {AppEventType} from '../../enums/appEvent/appEvent';
import {Platform} from '@ionic/angular';
import {debounceTime} from 'rxjs/operators';
import moment from 'moment';
import {FileEntry} from '@ionic-native/file';
import {UIHelper} from '../uiHelper';
import {UIBrewStorage} from '../uiBrewStorage';
import {UISettingsStorage} from '../uiSettingsStorage';
import {UIAlert} from '../uiAlert';

@Injectable({
  providedIn: 'root'
})
export class IosPlatformService {

  constructor(private readonly uiStorage: UIStorage,
              private readonly uiLog: UILog,
              private readonly uiFileHelper: UIFileHelper,
              private readonly eventQueue: EventQueueService,
              private readonly platform: Platform,
              private readonly uiHelper: UIHelper,
              private readonly uiSettingsStorage: UISettingsStorage,
              private readonly uiBrewStorage: UIBrewStorage,
              private readonly uiAlert: UIAlert) {

    if (this.platform.is('cordova') && this.platform.is('ios')) {
      this.uiHelper.isBeanconqurorAppReady().then(() => {
        // Delete on startup old json backup files
        this.uiFileHelper.deleteJSONBackupsOlderThenSevenDays().then(() => {

        }, () => {});
      },() => {});
      this.eventQueue.on(AppEventType.STORAGE_CHANGED).pipe(
        // Wait for 3 seconds before we call the the debounce
         debounceTime(3000)
      ).subscribe((event) => {
        const settings = this.uiSettingsStorage.getSettings();
        const welcomePagedShowed: boolean = settings.welcome_page_showed;
        const brewsAdded: boolean = this.uiBrewStorage.getAllEntries().length > 0;
        if (welcomePagedShowed && brewsAdded) {


          this.__saveBeanconquerorDump();
          this.__saveAutomaticBeanconquerorDump();
        }
      });
    }

  }

  private getAutomatedBackupFilename(): string {
    return moment().format('DD_MM_YYYY').toString();
  }


  private __saveBeanconquerorDump() {
    this.uiLog.log('iOS-Platform - Start to export JSON file');
    this.uiStorage.export().then((_data) => {
      this.uiFileHelper.saveJSONFile('Beanconqueror.json', JSON.stringify(_data)).then(async () => {
        this.uiLog.log('iOS-Platform - JSON file successfully saved');
      }, () => {
        this.uiLog.error('iOS-Platform - JSON file could not be saved');
      });
    });
  }
  private __saveAutomaticBeanconquerorDump() {
    this.uiLog.log('iOS-Platform - Start to export JSON file');
    this.uiStorage.export().then((_data) => {

      this.uiHelper.exportJSON('Beanconqueror_automatic_export_' + this.getAutomatedBackupFilename() + '.json', JSON.stringify(_data),false).then(async (_fileEntry: FileEntry) => {
        this.uiLog.log('iOS-Platform - JSON file successfully saved');
      }, () => {
        this.uiLog.error('iOS-Platform - JSON file could not be saved')
      });
    });
  }
  public async checkIOSBackup() {
    try {
      const promise = new Promise(async(resolve, reject) => {
      if (this.platform.is('cordova') && this.platform.is('ios')) {

        this.uiLog.log('iOS-Platform - Check IOS Backup');
        const hasData = await this.uiStorage.hasData();
        this.uiLog.log('iOS-Platform - Check IOS Backup - Has data ' + hasData);
        if (!hasData) {
          this.uiLog.log('iOS-Platform - Check IOS Backup - No data are stored yet inside the app, so we try to find a backup file - maybe its an iCloud installation');
          // If we don't got any data, we check now if there is a Beanconqueror.json saved.
          this.uiFileHelper.getJSONFile('Beanconqueror.json').then(async (_json) => {
            await this.uiAlert.showLoadingSpinner();
            this.uiLog.log('iOS-Platform - We found an iCloud backup, try to import');
            this.uiStorage.import(_json).then(async () => {
              this.uiLog.log('iOS-Platform sucessfully imported iCloud Backup');
              setTimeout(() => {
                this.uiAlert.hideLoadingSpinner();
              },150);
              resolve(null);
            },() => {
              this.uiLog.error('iOS-Platform could not import iCloud Backup');
              setTimeout(() => {
                this.uiAlert.hideLoadingSpinner();
              },150);
              resolve(null);
            });
          }, () => {
            this.uiLog.log('iOS-Platform - Check IOS Backup - We couldnt retrieve any file');
            resolve(null);
          });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
      });
      return promise;
    }catch(ex) {

    }


  }


}
