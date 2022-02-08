<script lang="ts">
  import "twind/shim"
  import { tw } from "twind"
  import logo from "./assets/svelte.png"
  import Head from "./lib/Head.svelte"
  import Kofi from "./lib/Kofi.svelte"
  import Menu from "./lib/Menu.svelte"
  import Social from "./lib/Social.svelte"

  const url = "https://troublesome-or-not.vercel.app"
  const title = "คุณคิดว่า..."

  // const menuItems = [{ name: "Github", url: "https://github.com/narze/troublesome-or-not" }]

  const description = ""
  const imageUrl =
    "https://raw.githubusercontent.com/narze/timelapse/master/projects/troublesome-or-not_home.png"
  const gtagId = null

  let x, y, value

  function submitIsTroublesome(e) {
    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = true
  }

  function submitIsNotTroublesome(e) {
    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = false
  }
</script>

<!-- <Kofi name="narze" label="Support Me" /> -->
<!-- <Menu items={menuItems} /> -->
<Social {url} {title} />
<Head {title} {description} {url} {imageUrl} {gtagId} />

<main class="w-full h-screen p-2 flex flex-col items-center">
  <h1 class="text-6xl flex gap-3 mt-2">
    สร้างความ<span class="underline text-red-600">เดือดร้อน</span>หรือไม่
  </h1>

  <div class="fixed">x: {x}, y: {y}, value: {value}</div>

  <div class="flex-grow w-full flex">
    <div class="flex-grow text-center flex flex-col">
      <p class="underline text-red-600 text-xl mt-4">เดือดร้อน</p>
      <div on:click={submitIsTroublesome} class="bg-gray-200 flex-grow mt-4" />
    </div>
    <span class="w-0.5 bg-black mt-14" />
    <div class="flex-grow text-center flex flex-col">
      <p class="underline text-red-600 text-xl mt-4">ไม่เดือดร้อน</p>
      <div on:click={submitIsNotTroublesome} class="bg-gray-200 flex-grow mt-4" />
    </div>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
