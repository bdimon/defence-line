import { NgModule } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonBadge,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItemDivider,
  IonList,
  IonAvatar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonSearchbar,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  
} from '@ionic/angular/standalone';


const ION_ELEMENTS = [
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonBadge,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItemDivider,
  IonList,
  IonAvatar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonSearchbar,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  
];

@NgModule({
  imports: [ION_ELEMENTS],
  exports: [ION_ELEMENTS]
})
export class IonicElementsModule {}
