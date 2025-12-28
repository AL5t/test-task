<template>
  <UISimpleDrawer
    :modelValue="PositionGroupStore.isVisibleDialogForAdding"
    title="Добавление типа оборудования"
    :width="460"
    scrim
    @update:modelValue="
      PositionGroupStore.toggleDialogForAdding();
      resetForm();
    "
  >
      <form
        @submit.prevent="onSubmit"
        class="form"
      >
        <div>
          <UITextField
            v-model="name"
            label="Название"
            clearable
          />
          <UISelectField
            v-model="spheres"
            :items="PositionGroupStore.sphereOptions"
            itemTitle="title"
			      itemValue="value"
            withCheckboxes
            label="Cферы"
            multiple
            clearable
            enable-select-all
            select-all-value="all"
          />
        </div>
        <div>
          <div class="archive-option">
            <p>Архив</p>
            <v-switch
              v-model="isArchived"
              color="primary"
            ></v-switch>
          </div>
          <UIButton variant="secondary" type="submit" class="submit-button" :disabled="!meta.valid">Сохранить</UIButton>
        </div>
      </form>
  </UISimpleDrawer>
</template>

<script setup lang="ts">
import { usePositionGroupsStore } from '@/stores/positionGroupsStore';
import { useForm } from 'vee-validate';
import { PositionGroupSchema } from '@/schemas/positionGroups.schema';

const PositionGroupStore = usePositionGroupsStore();

const { meta, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: PositionGroupSchema,
  initialValues: {
    name: '',
    spheres: [],
    isArchived: false
  }
});
const [ name ] = defineField('name');
const [ spheres ] = defineField('spheres');
const [ isArchived ] = defineField('isArchived');


const onSubmit = handleSubmit(async values => {
  await PositionGroupStore.createGroup(values);
  PositionGroupStore.toggleDialogForAdding();
  resetForm();
});
</script>

<style scoped lang="scss">
  .form {
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .archive-option {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .submit-button {
      width: 100%;
    }
  }
</style>