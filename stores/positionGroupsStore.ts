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
        result.push({title: sphere.name, value: sphere.id});
      });
      return result;
    }
  },

  actions: {
    async loadGroups() {
      this.loadingTable = true;

      const nuxtApp = useNuxtApp();
      const service = new PartnerZonesService(nuxtApp.$apiGateway as ApiGatewayClient);
      

      const response = await service.getPositionGroupsWeb({
        ids: null,
        type: this.selectedTypePositions,
        showArchived: false
      });

      this.groups = response.groups;
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