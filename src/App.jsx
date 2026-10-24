
import {
  useEffect,
  useDeferredValue,
  memo,
  useMemo,
  useState,
  useTransition,
} from 'react'
import './App.css'
import RenderPractice from './RenderPractice'
import UserList from './VirtualizationPractice'


const RESULT_LIMIT = 100
const TRANSITION_PREVIEW_COUNT = 2500

const fallbackUsers = [
  { id: 1, name: 'Ava Patel' },
  { id: 2, name: 'Noah Williams' },
  { id: 3, name: 'Mia Chen' },
  { id: 4, name: 'Ethan Johnson' },
  { id: 5, name: 'Sofia Garcia' },
  { id: 6, name: 'Leo Martin' },
  { id: 7, name: 'Amara Okafor' },
  { id: 8, name: 'Oliver Smith' },
  { id: 9, name: 'Isla Thompson' },
  { id: 10, name: 'Kai Nakamura' },
]

function buildDemoUsers(users) {
  return Array.from({ length: 5000 }, (_, batch) => users.map((user) => {
    const name = `${user.name} ${String(batch + 1).padStart(4, '0')}`
    return {
      id: `${batch}-${user.id}`,
      name,
      searchName: name.toLowerCase(),
    }
  })).flat()
}

const UserResults = memo(function UserResults({ users }) {
  return (
    <ul className="deferred-results">
      {users.slice(0, RESULT_LIMIT).map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
})

const TransitionPreview = memo(function TransitionPreview({ users }) {
  return (
    <ol className="transition-preview-list">
      {users.slice(0, TRANSITION_PREVIEW_COUNT).map((user, index) => (
        <li key={user.id}>
          <span>{String(index + 1).padStart(4, '0')}</span>
          {user.name}
        </li>
      ))}
    </ol>
  )
})

function App() {

  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeTab, setActiveTab] = useState('deferred')
  const [isPending, startTransition] = useTransition()

  // Defer the search value used by the results list
  const deferredSearch = useDeferredValue(inputValue)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) throw new Error('Could not load sample users')
        const users = await response.json()
        setData(buildDemoUsers(users))
      } catch {
        setData(buildDemoUsers(fallbackUsers))
        setLoadError('Remote sample data was unavailable, so built-in sample names are being used.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase()
    return data.filter((user) => user.searchName.includes(normalizedSearch))
  }, [data, deferredSearch])

  const isStale = inputValue !== deferredSearch

  function selectTab(tab) {
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (

    <main className="deferred-demo">
      {/* <header className="demo-header">
        <p className="demo-kicker">REACT 19 / CONCURRENCY LAB</p>
        <h1>Concurrency lab</h1>
        <p className="demo-intro">Compare two ways to keep urgent interactions responsive while React works on heavier UI.</p>
      </header>

      <div aria-label="Concurrency examples" className="lab-tabs" role="tablist">
        <button
          aria-controls="deferred-panel"
          aria-selected={activeTab === 'deferred'}
          className={activeTab === 'deferred' ? 'lab-tab is-active' : 'lab-tab'}
          id="deferred-tab"
          onClick={() => selectTab('deferred')}
          role="tab"
          type="button"
        >
          useDeferredValue
        </button>
        <button
          aria-controls="transition-panel"
          aria-selected={activeTab === 'transition'}
          className={activeTab === 'transition' ? 'lab-tab is-active' : 'lab-tab'}
          id="transition-tab"
          onClick={() => selectTab('transition')}
          role="tab"
          type="button"
        >
          useTransition
        </button>
      </div>

      {isPending && <p className="tab-pending" role="status">Preparing the next view...</p>}

      {activeTab === 'deferred' ? (
        <section aria-labelledby="deferred-tab" className="lab-panel" id="deferred-panel" role="tabpanel">
          <div className="panel-heading">
            <span className="demo-kicker">DEFER A VALUE</span>
            <h2>Keep typing urgent</h2>
            <p>Input state updates now. The list can keep using the previous search while React prepares the next results.</p>
          </div>
          <div className="demo-workspace">
            <label className="demo-search-label" htmlFor="user-search">Search the demo directory</label>
            <input
              autoComplete="off"
              className="demo-search"
              id="user-search"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Try a name, like Ava or Chen"
              value={inputValue}
            />

            <div className="demo-meta">
              <span>{data.length.toLocaleString()} records</span>
              <span>{filteredUsers.length.toLocaleString()} matches</span>
            </div>

            {loadError && <p className="demo-fallback">{loadError}</p>}
            {isStale && (
              <p className="demo-pending" role="status">
                Input: “{inputValue}” / Results: “{deferredSearch}”
              </p>
            )}
            {isLoading ? (
              <p className="demo-message">Loading sample users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="demo-message">No matches. Try another search.</p>
            ) : (
              <div aria-busy={isStale} className={`demo-results${isStale ? ' is-stale' : ''}`}>
                <UserResults users={filteredUsers} />
                {filteredUsers.length > RESULT_LIMIT && (
                  <p className="demo-limit">Showing {RESULT_LIMIT} of {filteredUsers.length.toLocaleString()} matches.</p>
                )}
              </div>
            )}
          </div>
          <aside className="demo-explanation">
            <strong>What to notice</strong>
            <p><code>useDeferredValue(inputValue)</code> gives the results a lower-priority version of the input. The input itself stays controlled by the current value.</p>
          </aside>
        </section>
      ) : (
        <section aria-labelledby="transition-tab" className="lab-panel" id="transition-panel" role="tabpanel">
          <div className="panel-heading">
            <span className="demo-kicker">MARK A STATE UPDATE NON-URGENT</span>
            <h2>Let React prepare a new view</h2>
            <p>This tab selection is wrapped in <code>startTransition</code>. The panel renders up to {TRANSITION_PREVIEW_COUNT.toLocaleString()} rows to give React more work to schedule.</p>
          </div>
          {isLoading ? (
            <p className="demo-message">Loading sample users...</p>
          ) : (
            <div aria-busy={isPending} className={`transition-preview${isPending ? ' is-pending' : ''}`}>
              <TransitionPreview users={data} />
              <p className="demo-limit">Previewing {Math.min(data.length, TRANSITION_PREVIEW_COUNT).toLocaleString()} of {data.length.toLocaleString()} records.</p>
            </div>
          )}
          <aside className="demo-explanation">
            <strong>What to notice</strong>
            <p><code>startTransition(() =&gt; setActiveTab(...))</code> marks this state update as non-urgent. <code>isPending</code> reports while React works on it.</p>
          </aside>
        </section>
      )} */}
      {/* <RenderPractice /> */}
      his
      <UserList />
    </main>
  )
}

export default App
