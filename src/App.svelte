<script lang="ts">
  import "twind/shim"
  import { tw } from "twind"
  import logo from "./assets/svelte.png"
  import Head from "./lib/Head.svelte"
  import Kofi from "./lib/Kofi.svelte"
  import Menu from "./lib/Menu.svelte"
  import Social from "./lib/Social.svelte"
  import { db } from "./lib/firebase"
  import { collection, onSnapshot, doc, query, limit, setDoc, updateDoc } from "firebase/firestore"
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
  let troublesomeEntries: Array<{ x: number; y: number; id: string }> = []
  let notTroublesomeEntries: Array<{ x: number; y: number; id: string }> = []
  let active = true

  // onSnapshot(query(collection(db, "votes"), limit(1000)), (querySnapshot) => {
  //   const entries: Array<{ id: string; value: boolean; x: number; y: number }> = []

  //   querySnapshot.forEach((doc) => {
  //     entries.push({ id: doc.id, ...doc.data() } as unknown as any)
  //   })
  //   console.log("Current old ", entries)

  //   const data = {}
  //   entries.forEach(({ id, x, y, value }) => {
  //     data[id] = { x: round(x), y: round(y), value }
  //   })

  //   setDoc(docRef, data, { merge: true })
  // })

  const date = new Date().toISOString().split("T")[0]
  const docRef = doc(db, "votesMap", date)

  const unsub = onSnapshot(query(collection(db, "votesMap")), (querySnapshot) => {
    const entries: Record<string, { x: number; y: number; value: boolean }> = {}
    const t: Array<{ x: number; y: number; id: string }> = []
    const nt: Array<{ x: number; y: number; id: string }> = []

    querySnapshot.forEach((doc) => {
      Object.entries(doc.data()).forEach(([id, values]) => {
        entries[id] = { id, ...values }
      })
    })
    console.log("Current data ", entries)

    Object.entries(entries).forEach(([id, entry]) => {
      const { x, y, value } = entry

      if (value) {
        t.push({ x, y, id })
      } else {
        nt.push({ x, y, id })
      }
    })

    troublesomeEntries = t
    notTroublesomeEntries = nt
  })

  // Active for 10 seconds only, to save quotas,
  setTimeout(() => {
    active = false
    unsub()
  }, 10000)

  async function submitIsTroublesome(e) {
    if (!active) {
      return
    }

    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = true

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")

    active = false
  }

  async function submitIsNotTroublesome(e) {
    if (!active) {
      return
    }

    const rect = e.target.getBoundingClientRect()
    x = ((e.clientX - rect.left) / rect.width) * 100
    y = ((e.clientY - rect.top) / rect.height) * 100
    value = false

    await upsert()

    alert("ขอบคุณสำหรับการโหวต!")

    active = false
  }

  async function upsert() {
    try {
      await setDoc(
        docRef,
        {
          [id]: { x: round(x), y: round(y), value },
        },
        { merge: true }
      )

      // console.log("Document upserted with ID: ", id, { x, y, value })
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  function round(num, decimalPlaces = 3) {
    var p = Math.pow(10, decimalPlaces)
    return Math.round(num * p) / p
  }
</script>

<!-- <Kofi name="narze" label="Support Me" /> -->
<!-- <Menu items={menuItems} /> -->
<Social {url} {title} />
<Head {title} {description} {url} {imageUrl} {gtagId} />

<main class="w-full h-screen p-2 flex flex-col items-center">
  <h1 class="text-4xl md:text-6xl flex gap-3 mt-2">
    สร้างความ<span class="underline text-red-600">เดือดร้อน</span>หรือไม่
  </h1>

  <!-- <div class="fixed">x: {x}, y: {y}, value: {value}</div> -->

  <div class="flex-grow w-full flex flex-col md:flex-row">
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
    <span class="h-0.5 w-full md:w-0.5 md:h-full bg-black md:mt-14" />
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
    border-color: limegreen;
    border-width: 2px;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    .sticker {
      margin-top: -0.75rem;
      margin-left: -0.75rem;
      height: 1.5rem;
      width: 1.5rem;
      border-width: 1px;
    }
  }
</style>
