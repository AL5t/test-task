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

      const response = await service.getPositionGroupsWeb({
        ids: [],
        type: this.selectedTypePositions,
        showArchived: false
      });

      const result = JSON.parse(response.response);
      console.log("loadGroups", result);

      this.groups = result.Groups;
      this.groups = [
        {
          id: '1',
          name: 'Group-1-eqip',
          description: 'deac',
          sphereIds: ['0b1cce85-847c-4791-b73f-ee4d61dd926e'],
          type: PositionGroupType.eqip,
          archived: false,
        },
        {
          id: '2',
          name: 'Group-2-eqip did',
          description: 'deac',
          sphereIds: ['1dcaa318-cd78-4db2-be4e-2d9af92e7e52'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '3',
          name: 'Group-3-eqip get',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '4',
          name: 'Group-4-eqip well',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', '303875ab-0cdd-47ed-b748-ca4255cf6a92'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '5',
          name: 'Group-5-eqip get well did',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', 'b6bee0f9-e5ad-4af4-8648-eedc822e4ea5', 'c5c0c43f-5d3f-48d9-b888-4c0441079402'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '6',
          name: 'Group-6-eqip',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', '0b1cce85-847c-4791-b73f-ee4d61dd926e', '1dcaa318-cd78-4db2-be4e-2d9af92e7e52'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '7',
          name: 'Group-7-eqip good did',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', '303875ab-0cdd-47ed-b748-ca4255cf6a92', '1dcaa318-cd78-4db2-be4e-2d9af92e7e52'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '8',
          name: 'Group-8-eqip journey',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', 'c5c0c43f-5d3f-48d9-b888-4c0441079402'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '9',
          name: 'Group-9-eqip response',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', 'b6bee0f9-e5ad-4af4-8648-eedc822e4ea5'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '10',
          name: 'Group-10-eqip request response',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', '1dcaa318-cd78-4db2-be4e-2d9af92e7e52', '0b1cce85-847c-4791-b73f-ee4d61dd926e', 'b3ad8dc1-0541-40ae-8dae-c104bbadef99', '303875ab-0cdd-47ed-b748-ca4255cf6a92'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '11',
          name: 'Group-11-eqip success true transfer',
          description: 'deac',
          sphereIds: ['3ae4c7d4-e2d0-439c-9536-9bd5f818bba4', 'c5c0c43f-5d3f-48d9-b888-4c0441079402'],
          type: PositionGroupType.eqip,
          archived: true,
        },
        {
          id: '123',
          name: 'Group-1-serv',
          description: 'deac',
          sphereIds: ['b3ad8dc1-0541-40ae-8dae-c104bbadef99'],
          type: PositionGroupType.serv,
          archived: false,
        },
        {
          id: '234',
          name: 'Group-2-serv',
          description: 'deac',
          sphereIds: ['303875ab-0cdd-47ed-b748-ca4255cf6a92', 'c5c0c43f-5d3f-48d9-b888-4c0441079402', 'b6bee0f9-e5ad-4af4-8648-eedc822e4ea5'],
          type: PositionGroupType.serv,
          archived: false,
        },
        {
          id: '345',
          name: 'Group-3-serv',
          description: 'deac',
          sphereIds: ['303875ab-0cdd-47ed-b748-ca4255cf6a92', 'b6bee0f9-e5ad-4af4-8648-eedc822e4ea5'],
          type: PositionGroupType.serv,
          archived: false,
        },
        {
          id: '456',
          name: 'Group-4-serv',
          description: 'deac',
          sphereIds: ['c5c0c43f-5d3f-48d9-b888-4c0441079402', 'b6bee0f9-e5ad-4af4-8648-eedc822e4ea5'],
          type: PositionGroupType.serv,
          archived: false,
        },
        {
          id: '567',
          name: 'Group-5-serv',
          description: 'deac',
          sphereIds: ['303875ab-0cdd-47ed-b748-ca4255cf6a92', 'c5c0c43f-5d3f-48d9-b888-4c0441079402'],
          type: PositionGroupType.serv,
          archived: false,
        },
      ];
      this.loadingTable = false;
    },

    async loadSpheres() {
      const nuxtApp = useNuxtApp();
      const service = new PartnerZonesService(nuxtApp.$apiGateway as ApiGatewayClient);

      const response = await service.getSpheres({id: null, isArchive: false});

      
      this.spheres = JSON.parse(response.response);
      console.log("loadSpheres", this.spheres);
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

    setSelectedTypePositions(type: PositionGroupType) {
      this.selectedTypePositions = type;
      this.loadGroups();
    },

    toggleDialogForAdding() {
      this.isVisibleDialogForAdding = !this.isVisibleDialogForAdding;
    }
  }
})