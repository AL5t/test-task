<template>
	<!-- Десктопная версия -->
	<v-navigation-drawer
		v-if="!isMobile"
		v-model="isOpen"
		location="right"
		temporary
		:scrim="false"
		:width="420"
		class="simple-drawer"
		:style="style"
		disable-resize-watcher
	>
		<!-- 🔥 Уведомления (десктоп) -->
		<Transition name="notify-slide">
			<div
				v-if="notificationVisible"
				class="drawer-notification"
				:class="`drawer-notification--${notificationType}`"
			>
				{{ notificationMessage }}
			</div>
		</Transition>

		<div class="drawer-wrapper">
			<div class="drawer-content">
				<!-- Шапка -->
				<v-toolbar flat class="drawer-header px-4">
					<template v-if="showBack" #prepend>
						<v-btn
							variant="text"
							icon="mdi-arrow-left"
							color="grey"
							@click="emit('back')"
						/>
					</template>
					<div class="drawer-header__content">
						<v-toolbar-title>{{ displayTitle }}</v-toolbar-title>
						<slot name="header-extra" />
					</div>
					<template #append>
						<v-btn
							variant="text"
							icon="mdi-close"
							color="grey"
							@click="closeDrawer"
						/>
					</template>
				</v-toolbar>
				<!-- Контент -->
				<div class="drawer-body">
					<slot />
				</div>

				<!-- Футер для десктопа -->
				<div v-if="footer" class="drawer-footer">
					<slot name="footer" />
				</div>
			</div>
		</div>
	</v-navigation-drawer>

	<!-- Кастомный скрим для десктопа -->
	<div v-if="isOpen && !isMobile" class="custom-scrim" @click="closeDrawer" />

	<!-- Мобильная версия -->
	<v-bottom-sheet v-else v-model="isOpen" scrollable persistent no-block-scroll>
		<!-- 🔥 Уведомления (мобилка) -->
		<Transition name="notify-slide">
			<div
				v-if="notificationVisible"
				class="drawer-notification drawer-notification--mobile"
				:class="`drawer-notification--${notificationType}`"
			>
				{{ notificationMessage }}
			</div>
		</Transition>

		<v-card class="mobile-drawer">
			<!-- Хэндл для перетаскивания -->
			<div class="mobile-drawer__handle">
				<div class="mobile-drawer__handle-bar" />
			</div>

			<!-- Шапка -->
			<v-toolbar flat class="mobile-drawer__toolbar px-4">
				<template v-if="showBack" #prepend>
					<v-btn
						variant="text"
						icon="mdi-arrow-left"
						color="grey"
						@click="emit('back')"
					/>
				</template>
				<div class="mobile-drawer__header-content">
					<v-toolbar-title class="mobile-drawer__title">{{
						displayTitle
					}}</v-toolbar-title>
					<slot name="header-extra" />
				</div>
				<template #append>
					<v-btn
						variant="text"
						icon="mdi-close"
						color="grey"
						@click="closeDrawer"
					/>
				</template>
			</v-toolbar>
			<!-- Контент -->
			<div class="mobile-drawer__content">
				<slot />
			</div>

			<!-- Футер с кнопками -->
			<div v-if="footer" class="mobile-drawer__footer">
				<slot name="footer" />
			</div>
		</v-card>
	</v-bottom-sheet>
</template>

<script setup>
import { useBreakpoint } from '@/composables/useBreakpoint';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '',
	},
	dynamicTitle: {
		type: String,
		default: '',
	},
	showBack: {
		type: Boolean,
		default: false,
	},
	width: {
		type: Number,
		default: 420,
	},
	zIndex: {
		type: Number,
		default: 1000,
	},
	scrim: {
		type: Boolean,
		default: false,
	},
	top: {
		type: Number,
		default: undefined,
	},
	flat: {
		type: Boolean,
		default: false,
	},
	border: {
		type: String,
		default: 'none',
	},
	errorText: {
		type: [String, Array],
		default: null,
	},
	footer: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'back']);

// Единая адаптивность: мобилка = xs/sm (как в BaseFilter/BottomSheetWrapper)
const { currentBreakpoint } = useBreakpoint();
const isMobile = computed(() => ['xs', 'sm'].includes(currentBreakpoint.value));

const style = computed(() => {
	const styles = {};
	if (isOpen.value) {
		styles['z-index'] = props.zIndex;
	}
	if (props.top) {
		styles.top = `${props.top}px`;
	}
	if (props.flat) {
		styles['box-shadow'] = 'none';
	}
	if (props.border) {
		styles['border'] = props.border;
	}
	return styles;
});

const isOpen = computed({
	get: () => props.modelValue,
	set: value => emit('update:modelValue', value),
});

// Приоритет: dynamicTitle > title > "Drawer"
const displayTitle = computed(() => {
	return props.dynamicTitle || props.title || 'Drawer';
});

const closeDrawer = () => {
	isOpen.value = false;
};

// 🔥 Система уведомлений
const notificationVisible = ref(false);
const notificationMessage = ref('');
const notificationType = ref('error'); // error | success | warning | info
let notificationTimeout = null;

/**
 * Показать уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип: 'error' | 'success' | 'warning' | 'info'
 * @param {number} duration - Длительность в мс (по умолчанию 3000)
 */
function showNotification(message, type = 'error', duration = 3000) {
	// Очищаем предыдущий таймаут
	if (notificationTimeout) {
		clearTimeout(notificationTimeout);
	}

	notificationMessage.value = message;
	notificationType.value = type;
	notificationVisible.value = true;

	// Автоматически скрываем через duration
	notificationTimeout = setTimeout(() => {
		notificationVisible.value = false;
	}, duration);
}

// Автоматически показываем уведомление при изменении errorText
watch(() => props.errorText, (newError) => {
	if (!newError || !isOpen.value) return;
	const message = Array.isArray(newError) 
		? newError.filter(Boolean).join('\n') 
		: String(newError);
	if (message) {
		showNotification(message, 'error');
	}
});

// Показываем уведомление об ошибке при открытии drawer, если errorText уже установлен
watch(() => isOpen.value, (opened) => {
	if (opened && props.errorText) {
		const message = Array.isArray(props.errorText) 
			? props.errorText.filter(Boolean).join('\n') 
			: String(props.errorText);
		if (message) {
			showNotification(message, 'error');
		}
	}
});

// Expose метод для внешнего использования
defineExpose({
	showNotification,
});
</script>

<style lang="scss" scoped>
// Стили для десктопной версии
:deep(.v-navigation-drawer__content) {
	border-radius: 10px 0;
}

.simple-drawer {
	border-radius: 10px;
}

.drawer-wrapper {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.drawer-content {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.drawer-header {
	background-color: white;
	border-bottom: 1px solid #e0e0e0;
	flex-shrink: 0;

	&__content {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	/* Разрешаем перенос и снятие обрезки у заголовка */
	:deep(.v-toolbar-title),
	:deep(.v-toolbar-title__placeholder) {
		white-space: pre-wrap;
		overflow: visible;
		text-overflow: clip; /* 'none' невалиден, используем 'clip' */
	}
}

.drawer-body {
	flex: 1;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 6px;

		&-track {
			background: #f1f1f1;
		}

		&-thumb {
			background: #888;
			border-radius: 3px;
		}
	}
}

// Стили для мобильной версии
.mobile-drawer {
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 90vh;
	max-height: 90vh;

	&__handle {
		display: flex;
		justify-content: center;
		padding: 12px 0;
		cursor: grab;
		touch-action: none;
		user-select: none;
		background-color: var(--v-theme-surface);

		&-bar {
			width: 40px;
			height: 4px;
			background-color: #e0e0e0;
			border-radius: 4px;
		}
	}

	&__toolbar {
		min-height: 56px;
		flex-shrink: 0;
		background-color: var(--v-theme-surface);
		border-bottom: 1px solid #e0e0e0;
	}

	&__header-content {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	&__title {
		font-size: 1.125rem;
		font-weight: 500;
		white-space: pre-wrap;
		overflow: visible;
		text-overflow: clip;
	}

	&__content {
		flex-grow: 1;
		overflow-y: auto;
		min-height: 100px;

		&::-webkit-scrollbar {
			width: 6px;

			&-track {
				background: #f1f1f1;
			}

			&-thumb {
				background: #888;
				border-radius: 3px;
			}
		}
	}

	&__footer {
		flex-shrink: 0;
		background-color: var(--v-theme-surface);
		border-top: 1px solid #e0e0e0;
		padding: 16px 20px;
	}
}

.drawer-footer {
	flex-shrink: 0;
	background-color: white;
	border-top: 1px solid #e0e0e0;
	padding: 16px 20px;
}

:deep(.v-navigation-drawer__content) {
	overflow-y: hidden;
}

// 🔥 Кастомный скрим (отключен нативный Vuetify)
::v-deep .v-navigation-drawer__scrim {
	height: 100dvh !important;
	min-height: 100dvh !important;
	top: 0 !important;
}

.custom-scrim {
	position: fixed;
	inset: 0;
	height: 100dvh;
	min-height: 100dvh;
	background: rgba(0, 0, 0, 0.4);
	z-index: 999; // Ниже чем drawer (zIndex по умолчанию 1000)
	cursor: pointer;
}

// 🔥 Уведомления
.drawer-notification {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10000;
	padding: 14px 20px;
	border-radius: 10px 10px 0 0;
	font-size: 14px;
	font-weight: 500;
	color: white;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	text-align: center;

	&--error {
		background: #ef4444;
	}

	&--success {
		background: #10b981;
	}

	&--warning {
		background: #f59e0b;
	}

	&--info {
		background: #3b82f6;
	}

	&--mobile {
		top: 80px; // Под шапкой мобильного дравера
	}
}

// Анимация
.notify-slide-enter-active,
.notify-slide-leave-active {
	transition: all 0.3s ease;
}

.notify-slide-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}

.notify-slide-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
