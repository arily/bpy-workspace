<script lang="ts" setup>
import type { IWindow } from '../composables/useWindowManager'

const {
  moveWindowToTop,
  managedWindow,
} = useGlobalWindowManager()

function entryClicked(window: IWindow) {
  moveWindowToTop(window.value.id)
  window.value.active = true
}
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Homepage</a></li>
          <li><a>Portfolio</a></li>
          <li><a>About</a></li>
        </ul>
      </div>
    </div>
    <div class="gap-2 navbar-center">
      <template v-for="[id, window] in managedWindow" :key="id">
        <button v-if="!window.value.active" class="btn" @click="entryClicked(window)">
          <img :src="window.value.titleIconURL" :alt="window.value.title" class="h-7">{{ window.value.title }}
        </button>
      </template>
      <template v-if="[...managedWindow.values()].every(i => i.value.active)">
        <div class="text-xl opacity-25">
          GuCamp
        </div>
      </template>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span class="rounded-full badge badge-xs badge-primary indicator-item" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
