import { PartnerZonesService } from '@/classes/api/PartnerZonesService';
import type { ApiGatewayClient } from '@/types/api';
import { PositionGroupType, type PositionGroup, type SphereDetail } from '@/types/partner-zones';

interface State {
  loadingTable: boolean
  groups: PositionGroup[]
  spheres: SphereDetail[]
  selectedTypePositions: PositionGroupType
  searchTerm: string
  selectedSphereIds: string[]
  isVisibleDialogForAdding: boolean
}

export const usePositionGroupsStore = defineStore('positionGroupsStore', {
  state: (): State => ({
    loadingTable: false,
    groups: [],
    spheres: [],
    selectedTypePositions: PositionGroupType.eqip,
    searchTerm: '',
    selectedSphereIds: [],
    isVisibleDialogForAdding: false,
  }),

  getters: {
    filtredGroups(state): PositionGroup[] {
      return state.groups
        .filter(group => group.type === this.selectedTypePositions)
        .filter(group => state.searchTerm ? group.name.toLocaleLowerCase().includes(state.searchTerm.toLocaleLowerCase()) : true)
        .filter(group => state.selectedSphereIds.length ? group.sphereIds.some(shp => state.selectedSphereIds.includes(shp)) : true);
    },

    sphereOptions(state) {
      const result = [{title: 'Все', value: 'all'}];
      state.spheres.forEach(sphere => {
        result.push({title: sphere.Name, value: sphere.Id});
      });
      return result;
    }
  },

  actions: {
    async loadGroups() {
      this.loadingTable = true;

      const nuxtApp = useNuxtApp();
      const service = new PartnerZonesService(nuxtApp.$apiGateway as ApiGatewayClient);

      // временное решение, т.к. пока нет метода для получения всех PositionGroups
      let positionGroupsIds = [];
      const positionGroupsFromLocalStorage = localStorage.getItem('position-groups');
      if(positionGroupsFromLocalStorage) {
        positionGroupsIds = JSON.parse(positionGroupsFromLocalStorage);
      }
      

      const response = await service.getPositionGroupsWeb({
        ids: positionGroupsIds,
        type: this.selectedTypePositions,
        showArchived: false
      });

      //временное решение, т.к. приходит ответ со свойствами в верхнем регистре
      if(response.Groups.length) {
        for(let group of response.Groups) {
          for(let key in group) {
            group[key[0].toLowerCase() + key.slice(1)] = group[key];
          }
        }
      }

      this.groups = response.Groups;
      this.loadingTable = false;
    },

    async loadSpheres() {
      const nuxtApp = useNuxtApp();
      const service = new PartnerZonesService(nuxtApp.$apiGateway as ApiGatewayClient);

      this.spheres = await service.getSpheres({id: null, isArchive: false});
    },

    async createGroup(params: {
      name: string,
      isArchived: boolean,
      spheres: string[],
    }) {
      const nuxtApp = useNuxtApp();
      const service = new PartnerZonesService(nuxtApp.$apiGateway as ApiGatewayClient);

      await service.createPositionGroup({
        name: params.name,
        description: '',
        isArchived: params.isArchived,
        type: this.selectedTypePositions,
        spheres: params.spheres,
      }).then((response) => {
        console.log('create', response);
        // временное решение, т.к. пока нет метода для получения всех PositionGroups, поэтому новые сохраняю в localStorage
        if(response) {
          const positionGroupsFromLocalStorage = localStorage.getItem('position-groups');
          let newPositionGroups = [];
          if(positionGroupsFromLocalStorage) {
            newPositionGroups = JSON.parse(positionGroupsFromLocalStorage);
            newPositionGroups.push(response);
          } else {
            newPositionGroups.push(response);
          }
          localStorage.setItem('position-groups', JSON.stringify(newPositionGroups));
        }
      });

      await this.loadGroups();
    },

    async setSelectedTypePositions(type: PositionGroupType) {
      if(this.selectedTypePositions === type) {
        return;
      }
      this.selectedTypePositions = type;
      await this.loadGroups();
    },

    toggleDialogForAdding() {
      this.isVisibleDialogForAdding = !this.isVisibleDialogForAdding;
    }
  }
})