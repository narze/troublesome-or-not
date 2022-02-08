<script lang="ts">
  import "twind/shim"
  import { tw } from "twind"
  import logo from "./assets/svelte.png"
  import Head from "./lib/Head.svelte"
  import Kofi from "./lib/Kofi.svelte"
  import Menu from "./lib/Menu.svelte"
  import Social from "./lib/Social.svelte"
  import { db } from "./lib/firebase"
  import { collection, onSnapshot, doc, query, limit, setDoc } from "firebase/firestore"
  import { nanoid } from "nanoid"

  const url = "https://troublesome-or-not.vercel.app"
  const title = "คุณคิดว่า..."

  // const menuItems = [{ name: "Github", url: "https://github.com/narze/troublesome-or-not" }]

  const description = ""
  const imageUrl =
    "https://raw.githubusercontent.com/narze/timelapse/master/projects/troublesome-or-not_home.png"
  const gtagId = null
  const id = localStorage.getItem("ton-id") || nanoid()

  localStorage.setItem("ton-id", id)

  let x, y, value
  let troublesomeEntries = []
  let notTroublesomeEntries = []

  const unsub = onSnapshot(query(collection(db, "votes"), limit(1000)), (querySnapshot) => {
    const entries = []
    const t = []
    const nt = []

    querySnapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() })
    })
    console.log("Current data ", entries)

    entries.forEach((entry) => {
      if (entry.value) {
        t.push(entry)
      } else {
        nt.push(entry)
      }
    })

    troublesomeEntries = t
    notTroublesomeEntries = nt
  })

  async function submitIsTroublesome(e) {
    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = true

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")
  }

  async function submitIsNotTroublesome(e) {
    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = false

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")
  }

  async function upsert() {
    try {
      await setDoc(doc(db, "votes", id), {
        x,
        y,
        value,
      })

      console.log("Document upserted with ID: ", id, { x, y, value })
    } catch (e) {
      console.error("Error adding document: ", e)
    }
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

  <!-- <div class="fixed">x: {x}, y: {y}, value: {value}</div> -->

  <div class="flex-grow w-full flex">
    <div class="flex-grow text-center flex flex-col">
      <p class="underline text-red-600 text-xl mt-4">เดือดร้อน</p>
      <div on:click={submitIsTroublesome} class="flex-grow mt-4 relative">
        {#each troublesomeEntries as entry (entry.id)}
          <div class="sticker absolute" style={`top: ${entry.y}%; left: ${entry.x}%; `}>
            <!-- {entry.id} -->
          </div>
        {/each}
      </div>
      <p>{troublesomeEntries.length}</p>
    </div>
    <span class="w-0.5 bg-black mt-14" />
    <div class="flex-grow text-center flex flex-col">
      <p class="underline text-red-600 text-xl mt-4">ไม่เดือดร้อน</p>
      <div on:click={submitIsNotTroublesome} class="flex-grow mt-4 relative">
        {#each notTroublesomeEntries as entry (entry.id)}
          <div class="sticker absolute" style={`top: ${entry.y}%; left: ${entry.x}%; `}>
            <!-- {entry.id} -->
          </div>
        {/each}
      </div>
      <p>{notTroublesomeEntries.length}</p>
    </div>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
      "Open Sans", "Helvetica Neue", sans-serif;
  }

  .sticker {
    margin-top: -1rem;
    margin-left: -1rem;
    height: 2rem;
    width: 2rem;
    background-color: lime;
    border-radius: 50%;
  }
</style>
