/**
 * Bundled by jsDelivr using Rollup v2.70.1 and Terser v5.10.0.
 * Original file: /npm/bottleneck@2.19.5/lib/index.js
 * file from: https://cdn.jsdelivr.net/npm/bottleneck/+esm
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var parser$8 = {},
    DLList$2;
parser$8.load = function (e, t, n = {}) {
    var r, i, s;
    for (r in t) s = t[r], n[r] = null != (i = e[r]) ? i : s;
    return n
}, parser$8.overwrite = function (e, t, n = {}) {
    var r, i;
    for (r in e) i = e[r], void 0 !== t[r] && (n[r] = i);
    return n
}, DLList$2 = class {
    constructor(e, t) {
        this.incr = e, this.decr = t, this._first = null, this._last = null, this.length = 0
    }
    push(e) {
        var t;
        this.length++, "function" == typeof this.incr && this.incr(), t = {
            value: e,
            prev: this._last,
            next: null
        }, null != this._last ? (this._last.next = t, this._last = t) : this._first = this._last = t
    }
    shift() {
        var e;
        if (null != this._first) return this.length--, "function" == typeof this.decr && this.decr(), e = this._first.value, null != (this._first = this._first.next) ? this._first.prev = null : this._last = null, e
    }
    first() {
        if (null != this._first) return this._first.value
    }
    getArray() {
        var e, t, n;
        for (e = this._first, n = []; null != e;) n.push((t = e, e = e.next, t.value));
        return n
    }
    forEachShift(e) {
        var t;
        for (t = this.shift(); null != t;) e(t), t = this.shift()
    }
    debug() {
        var e, t, n, r, i;
        for (e = this._first, i = []; null != e;) i.push((t = e, e = e.next, {
            value: t.value,
            prev: null != (n = t.prev) ? n.value : void 0,
            next: null != (r = t.next) ? r.value : void 0
        }));
        return i
    }
};
var DLList_1 = DLList$2,
    Events$6;

function asyncGeneratorStep$8(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$8(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$8(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$8(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
Events$6 = class {
    constructor(e) {
        if (this.instance = e, this._events = {}, null != this.instance.on || null != this.instance.once || null != this.instance.removeAllListeners) throw new Error("An Emitter already exists for this object");
        this.instance.on = (e, t) => this._addListener(e, "many", t), this.instance.once = (e, t) => this._addListener(e, "once", t), this.instance.removeAllListeners = (e = null) => null != e ? delete this._events[e] : this._events = {}
    }
    _addListener(e, t, n) {
        var r;
        return null == (r = this._events)[e] && (r[e] = []), this._events[e].push({
            cb: n,
            status: t
        }), this.instance
    }
    listenerCount(e) {
        return null != this._events[e] ? this._events[e].length : 0
    }
    trigger(e, ...t) {
        var n = this;
        return _asyncToGenerator$8((function* () {
            var r, i;
            try {
                if ("debug" !== e && n.trigger("debug", `Event triggered: ${e}`, t), null == n._events[e]) return;
                return n._events[e] = n._events[e].filter((function (e) {
                    return "none" !== e.status
                })), i = n._events[e].map(function () {
                    var e = _asyncToGenerator$8((function* (e) {
                        var r, i;
                        if ("none" !== e.status) {
                            "once" === e.status && (e.status = "none");
                            try {
                                return "function" == typeof (null != (i = "function" == typeof e.cb ? e.cb(...t) : void 0) ? i.then : void 0) ? yield i: i
                            } catch (e) {
                                return r = e, n.trigger("error", r), null
                            }
                        }
                    }));
                    return function (t) {
                        return e.apply(this, arguments)
                    }
                }()), (yield Promise.all(i)).find((function (e) {
                    return null != e
                }))
            } catch (e) {
                return r = e, n.trigger("error", r), null
            }
        }))()
    }
};
var Events_1 = Events$6,
    DLList$1, Events$5, Queues$1;
DLList$1 = DLList_1, Events$5 = Events_1, Queues$1 = class {
    constructor(e) {
        this.Events = new Events$5(this), this._length = 0, this._lists = function () {
            var t, n, r;
            for (r = [], t = 1, n = e; 1 <= n ? t <= n : t >= n; 1 <= n ? ++t : --t) r.push(new DLList$1((() => this.incr()), (() => this.decr())));
            return r
        }.call(this)
    }
    incr() {
        if (0 == this._length++) return this.Events.trigger("leftzero")
    }
    decr() {
        if (0 == --this._length) return this.Events.trigger("zero")
    }
    push(e) {
        return this._lists[e.options.priority].push(e)
    }
    queued(e) {
        return null != e ? this._lists[e].length : this._length
    }
    shiftAll(e) {
        return this._lists.forEach((function (t) {
            return t.forEachShift(e)
        }))
    }
    getFirst(e = this._lists) {
        var t, n, r;
        for (t = 0, n = e.length; t < n; t++)
            if ((r = e[t]).length > 0) return r;
        return []
    }
    shiftLastFrom(e) {
        return this.getFirst(this._lists.slice(e).reverse()).shift()
    }
};
var Queues_1 = Queues$1,
    BottleneckError$4;
BottleneckError$4 = class extends Error {};
var BottleneckError_1 = BottleneckError$4,
    BottleneckError$3, DEFAULT_PRIORITY$1, Job$1, NUM_PRIORITIES$1, parser$7;

function asyncGeneratorStep$7(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$7(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$7(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$7(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
NUM_PRIORITIES$1 = 10, DEFAULT_PRIORITY$1 = 5, parser$7 = parser$8, BottleneckError$3 = BottleneckError_1, Job$1 = class {
    constructor(e, t, n, r, i, s, o, a) {
        this.task = e, this.args = t, this.rejectOnDrop = i, this.Events = s, this._states = o, this.Promise = a, this.options = parser$7.load(n, r), this.options.priority = this._sanitizePriority(this.options.priority), this.options.id === r.id && (this.options.id = `${this.options.id}-${this._randomIndex()}`), this.promise = new this.Promise(((e, t) => {
            this._resolve = e, this._reject = t
        })), this.retryCount = 0
    }
    _sanitizePriority(e) {
        var t;
        return (t = ~~e !== e ? DEFAULT_PRIORITY$1 : e) < 0 ? 0 : t > NUM_PRIORITIES$1 - 1 ? NUM_PRIORITIES$1 - 1 : t
    }
    _randomIndex() {
        return Math.random().toString(36).slice(2)
    }
    doDrop({
        error: e,
        message: t = "This job has been dropped by Bottleneck"
    } = {}) {
        return !!this._states.remove(this.options.id) && (this.rejectOnDrop && this._reject(null != e ? e : new BottleneckError$3(t)), this.Events.trigger("dropped", {
            args: this.args,
            options: this.options,
            task: this.task,
            promise: this.promise
        }), !0)
    }
    _assertStatus(e) {
        var t;
        if ((t = this._states.jobStatus(this.options.id)) !== e && ("DONE" !== e || null !== t)) throw new BottleneckError$3(`Invalid job status ${t}, expected ${e}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`)
    }
    doReceive() {
        return this._states.start(this.options.id), this.Events.trigger("received", {
            args: this.args,
            options: this.options
        })
    }
    doQueue(e, t) {
        return this._assertStatus("RECEIVED"), this._states.next(this.options.id), this.Events.trigger("queued", {
            args: this.args,
            options: this.options,
            reachedHWM: e,
            blocked: t
        })
    }
    doRun() {
        return 0 === this.retryCount ? (this._assertStatus("QUEUED"), this._states.next(this.options.id)) : this._assertStatus("EXECUTING"), this.Events.trigger("scheduled", {
            args: this.args,
            options: this.options
        })
    }
    doExecute(e, t, n, r) {
        var i = this;
        return _asyncToGenerator$7((function* () {
            var s, o, a;
            0 === i.retryCount ? (i._assertStatus("RUNNING"), i._states.next(i.options.id)) : i._assertStatus("EXECUTING"), o = {
                args: i.args,
                options: i.options,
                retryCount: i.retryCount
            }, i.Events.trigger("executing", o);
            try {
                if (a = yield null != e ? e.schedule(i.options, i.task, ...i.args) : i.task(...i.args), t()) return i.doDone(o), yield r(i.options, o), i._assertStatus("DONE"), i._resolve(a)
            } catch (e) {
                return s = e, i._onFailure(s, o, t, n, r)
            }
        }))()
    }
    doExpire(e, t, n) {
        var r, i;
        return this._states.jobStatus("RUNNING" === this.options.id) && this._states.next(this.options.id), this._assertStatus("EXECUTING"), i = {
            args: this.args,
            options: this.options,
            retryCount: this.retryCount
        }, r = new BottleneckError$3(`This job timed out after ${this.options.expiration} ms.`), this._onFailure(r, i, e, t, n)
    }
    _onFailure(e, t, n, r, i) {
        var s = this;
        return _asyncToGenerator$7((function* () {
            var o, a;
            if (n()) return null != (o = yield s.Events.trigger("failed", e, t)) ? (a = ~~o, s.Events.trigger("retry", `Retrying ${s.options.id} after ${a} ms`, t), s.retryCount++, r(a)) : (s.doDone(t), yield i(s.options, t), s._assertStatus("DONE"), s._reject(e))
        }))()
    }
    doDone(e) {
        return this._assertStatus("EXECUTING"), this._states.next(this.options.id), this.Events.trigger("done", e)
    }
};
var Job_1 = Job$1,
    BottleneckError$2, LocalDatastore$1, parser$6;

function asyncGeneratorStep$6(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$6(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$6(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$6(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
parser$6 = parser$8, BottleneckError$2 = BottleneckError_1, LocalDatastore$1 = class {
    constructor(e, t, n) {
        this.instance = e, this.storeOptions = t, this.clientId = this.instance._randomIndex(), parser$6.load(n, n, this), this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now(), this._running = 0, this._done = 0, this._unblockTime = 0, this.ready = this.Promise.resolve(), this.clients = {}, this._startHeartbeat()
    }
    _startHeartbeat() {
        var e;
        return null == this.heartbeat && (null != this.storeOptions.reservoirRefreshInterval && null != this.storeOptions.reservoirRefreshAmount || null != this.storeOptions.reservoirIncreaseInterval && null != this.storeOptions.reservoirIncreaseAmount) ? "function" == typeof (e = this.heartbeat = setInterval((() => {
            var e, t, n, r, i;
            if (r = Date.now(), null != this.storeOptions.reservoirRefreshInterval && r >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval && (this._lastReservoirRefresh = r, this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount, this.instance._drainAll(this.computeCapacity())), null != this.storeOptions.reservoirIncreaseInterval && r >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval) {
                var s = this.storeOptions;
                if (e = s.reservoirIncreaseAmount, n = s.reservoirIncreaseMaximum, i = s.reservoir, this._lastReservoirIncrease = r, (t = null != n ? Math.min(e, n - i) : e) > 0) return this.storeOptions.reservoir += t, this.instance._drainAll(this.computeCapacity())
            }
        }), this.heartbeatInterval)).unref ? e.unref() : void 0 : clearInterval(this.heartbeat)
    }
    __publish__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            return yield t.yieldLoop(), t.instance.Events.trigger("message", e.toString())
        }))()
    }
    __disconnect__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            return yield t.yieldLoop(), clearInterval(t.heartbeat), t.Promise.resolve()
        }))()
    }
    yieldLoop(e = 0) {
        return new this.Promise((function (t, n) {
            return setTimeout(t, e)
        }))
    }
    computePenalty() {
        var e;
        return null != (e = this.storeOptions.penalty) ? e : 15 * this.storeOptions.minTime || 5e3
    }
    __updateSettings__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            return yield t.yieldLoop(), parser$6.overwrite(e, e, t.storeOptions), t._startHeartbeat(), t.instance._drainAll(t.computeCapacity()), !0
        }))()
    }
    __running__() {
        var e = this;
        return _asyncToGenerator$6((function* () {
            return yield e.yieldLoop(), e._running
        }))()
    }
    __queued__() {
        var e = this;
        return _asyncToGenerator$6((function* () {
            return yield e.yieldLoop(), e.instance.queued()
        }))()
    }
    __done__() {
        var e = this;
        return _asyncToGenerator$6((function* () {
            return yield e.yieldLoop(), e._done
        }))()
    }
    __groupCheck__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            return yield t.yieldLoop(), t._nextRequest + t.timeout < e
        }))()
    }
    computeCapacity() {
        var e, t, n = this.storeOptions;
        return e = n.maxConcurrent, t = n.reservoir, null != e && null != t ? Math.min(e - this._running, t) : null != e ? e - this._running : null != t ? t : null
    }
    conditionsCheck(e) {
        var t;
        return null == (t = this.computeCapacity()) || e <= t
    }
    __incrementReservoir__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            var n;
            return yield t.yieldLoop(), n = t.storeOptions.reservoir += e, t.instance._drainAll(t.computeCapacity()), n
        }))()
    }
    __currentReservoir__() {
        var e = this;
        return _asyncToGenerator$6((function* () {
            return yield e.yieldLoop(), e.storeOptions.reservoir
        }))()
    }
    isBlocked(e) {
        return this._unblockTime >= e
    }
    check(e, t) {
        return this.conditionsCheck(e) && this._nextRequest - t <= 0
    }
    __check__(e) {
        var t = this;
        return _asyncToGenerator$6((function* () {
            var n;
            return yield t.yieldLoop(), n = Date.now(), t.check(e, n)
        }))()
    }
    __register__(e, t, n) {
        var r = this;
        return _asyncToGenerator$6((function* () {
            var e, n;
            return yield r.yieldLoop(), e = Date.now(), r.conditionsCheck(t) ? (r._running += t, null != r.storeOptions.reservoir && (r.storeOptions.reservoir -= t), n = Math.max(r._nextRequest - e, 0), r._nextRequest = e + n + r.storeOptions.minTime, {
                success: !0,
                wait: n,
                reservoir: r.storeOptions.reservoir
            }) : {
                success: !1
            }
        }))()
    }
    strategyIsBlock() {
        return 3 === this.storeOptions.strategy
    }
    __submit__(e, t) {
        var n = this;
        return _asyncToGenerator$6((function* () {
            var r, i, s;
            if (yield n.yieldLoop(), null != n.storeOptions.maxConcurrent && t > n.storeOptions.maxConcurrent) throw new BottleneckError$2(`Impossible to add a job having a weight of ${t} to a limiter having a maxConcurrent setting of ${n.storeOptions.maxConcurrent}`);
            return i = Date.now(), s = null != n.storeOptions.highWater && e === n.storeOptions.highWater && !n.check(t, i), (r = n.strategyIsBlock() && (s || n.isBlocked(i))) && (n._unblockTime = i + n.computePenalty(), n._nextRequest = n._unblockTime + n.storeOptions.minTime, n.instance._dropAllQueued()), {
                reachedHWM: s,
                blocked: r,
                strategy: n.storeOptions.strategy
            }
        }))()
    }
    __free__(e, t) {
        var n = this;
        return _asyncToGenerator$6((function* () {
            return yield n.yieldLoop(), n._running -= t, n._done += t, n.instance._drainAll(n.computeCapacity()), {
                running: n._running
            }
        }))()
    }
};
var LocalDatastore_1 = LocalDatastore$1,
    Scripts$3 = {},
    require$$0 = {
        "blacklist_client.lua": "local blacklist = ARGV[num_static_argv + 1]\n\nif redis.call('zscore', client_last_seen_key, blacklist) then\n  redis.call('zadd', client_last_seen_key, 0, blacklist)\nend\n\n\nreturn {}\n",
        "check.lua": "local weight = tonumber(ARGV[num_static_argv + 1])\n\nlocal capacity = process_tick(now, false)['capacity']\nlocal nextRequest = tonumber(redis.call('hget', settings_key, 'nextRequest'))\n\nreturn conditions_check(capacity, weight) and nextRequest - now <= 0\n",
        "conditions_check.lua": "local conditions_check = function (capacity, weight)\n  return capacity == nil or weight <= capacity\nend\n",
        "current_reservoir.lua": "return process_tick(now, false)['reservoir']\n",
        "done.lua": "process_tick(now, false)\n\nreturn tonumber(redis.call('hget', settings_key, 'done'))\n",
        "free.lua": "local index = ARGV[num_static_argv + 1]\n\nredis.call('zadd', job_expirations_key, 0, index)\n\nreturn process_tick(now, false)['running']\n",
        "get_time.lua": "redis.replicate_commands()\n\nlocal get_time = function ()\n  local time = redis.call('time')\n\n  return tonumber(time[1]..string.sub(time[2], 1, 3))\nend\n",
        "group_check.lua": "return not (redis.call('exists', settings_key) == 1)\n",
        "heartbeat.lua": "process_tick(now, true)\n",
        "increment_reservoir.lua": "local incr = tonumber(ARGV[num_static_argv + 1])\n\nredis.call('hincrby', settings_key, 'reservoir', incr)\n\nlocal reservoir = process_tick(now, true)['reservoir']\n\nlocal groupTimeout = tonumber(redis.call('hget', settings_key, 'groupTimeout'))\nrefresh_expiration(0, 0, groupTimeout)\n\nreturn reservoir\n",
        "init.lua": "local clear = tonumber(ARGV[num_static_argv + 1])\nlocal limiter_version = ARGV[num_static_argv + 2]\nlocal num_local_argv = num_static_argv + 2\n\nif clear == 1 then\n  redis.call('del', unpack(KEYS))\nend\n\nif redis.call('exists', settings_key) == 0 then\n  -- Create\n  local args = {'hmset', settings_key}\n\n  for i = num_local_argv + 1, #ARGV do\n    table.insert(args, ARGV[i])\n  end\n\n  redis.call(unpack(args))\n  redis.call('hmset', settings_key,\n    'nextRequest', now,\n    'lastReservoirRefresh', now,\n    'lastReservoirIncrease', now,\n    'running', 0,\n    'done', 0,\n    'unblockTime', 0,\n    'capacityPriorityCounter', 0\n  )\n\nelse\n  -- Apply migrations\n  local settings = redis.call('hmget', settings_key,\n    'id',\n    'version'\n  )\n  local id = settings[1]\n  local current_version = settings[2]\n\n  if current_version ~= limiter_version then\n    local version_digits = {}\n    for k, v in string.gmatch(current_version, \"([^.]+)\") do\n      table.insert(version_digits, tonumber(k))\n    end\n\n    -- 2.10.0\n    if version_digits[2] < 10 then\n      redis.call('hsetnx', settings_key, 'reservoirRefreshInterval', '')\n      redis.call('hsetnx', settings_key, 'reservoirRefreshAmount', '')\n      redis.call('hsetnx', settings_key, 'lastReservoirRefresh', '')\n      redis.call('hsetnx', settings_key, 'done', 0)\n      redis.call('hset', settings_key, 'version', '2.10.0')\n    end\n\n    -- 2.11.1\n    if version_digits[2] < 11 or (version_digits[2] == 11 and version_digits[3] < 1) then\n      if redis.call('hstrlen', settings_key, 'lastReservoirRefresh') == 0 then\n        redis.call('hmset', settings_key,\n          'lastReservoirRefresh', now,\n          'version', '2.11.1'\n        )\n      end\n    end\n\n    -- 2.14.0\n    if version_digits[2] < 14 then\n      local old_running_key = 'b_'..id..'_running'\n      local old_executing_key = 'b_'..id..'_executing'\n\n      if redis.call('exists', old_running_key) == 1 then\n        redis.call('rename', old_running_key, job_weights_key)\n      end\n      if redis.call('exists', old_executing_key) == 1 then\n        redis.call('rename', old_executing_key, job_expirations_key)\n      end\n      redis.call('hset', settings_key, 'version', '2.14.0')\n    end\n\n    -- 2.15.2\n    if version_digits[2] < 15 or (version_digits[2] == 15 and version_digits[3] < 2) then\n      redis.call('hsetnx', settings_key, 'capacityPriorityCounter', 0)\n      redis.call('hset', settings_key, 'version', '2.15.2')\n    end\n\n    -- 2.17.0\n    if version_digits[2] < 17 then\n      redis.call('hsetnx', settings_key, 'clientTimeout', 10000)\n      redis.call('hset', settings_key, 'version', '2.17.0')\n    end\n\n    -- 2.18.0\n    if version_digits[2] < 18 then\n      redis.call('hsetnx', settings_key, 'reservoirIncreaseInterval', '')\n      redis.call('hsetnx', settings_key, 'reservoirIncreaseAmount', '')\n      redis.call('hsetnx', settings_key, 'reservoirIncreaseMaximum', '')\n      redis.call('hsetnx', settings_key, 'lastReservoirIncrease', now)\n      redis.call('hset', settings_key, 'version', '2.18.0')\n    end\n\n  end\n\n  process_tick(now, false)\nend\n\nlocal groupTimeout = tonumber(redis.call('hget', settings_key, 'groupTimeout'))\nrefresh_expiration(0, 0, groupTimeout)\n\nreturn {}\n",
        "process_tick.lua": "local process_tick = function (now, always_publish)\n\n  local compute_capacity = function (maxConcurrent, running, reservoir)\n    if maxConcurrent ~= nil and reservoir ~= nil then\n      return math.min((maxConcurrent - running), reservoir)\n    elseif maxConcurrent ~= nil then\n      return maxConcurrent - running\n    elseif reservoir ~= nil then\n      return reservoir\n    else\n      return nil\n    end\n  end\n\n  local settings = redis.call('hmget', settings_key,\n    'id',\n    'maxConcurrent',\n    'running',\n    'reservoir',\n    'reservoirRefreshInterval',\n    'reservoirRefreshAmount',\n    'lastReservoirRefresh',\n    'reservoirIncreaseInterval',\n    'reservoirIncreaseAmount',\n    'reservoirIncreaseMaximum',\n    'lastReservoirIncrease',\n    'capacityPriorityCounter',\n    'clientTimeout'\n  )\n  local id = settings[1]\n  local maxConcurrent = tonumber(settings[2])\n  local running = tonumber(settings[3])\n  local reservoir = tonumber(settings[4])\n  local reservoirRefreshInterval = tonumber(settings[5])\n  local reservoirRefreshAmount = tonumber(settings[6])\n  local lastReservoirRefresh = tonumber(settings[7])\n  local reservoirIncreaseInterval = tonumber(settings[8])\n  local reservoirIncreaseAmount = tonumber(settings[9])\n  local reservoirIncreaseMaximum = tonumber(settings[10])\n  local lastReservoirIncrease = tonumber(settings[11])\n  local capacityPriorityCounter = tonumber(settings[12])\n  local clientTimeout = tonumber(settings[13])\n\n  local initial_capacity = compute_capacity(maxConcurrent, running, reservoir)\n\n  --\n  -- Process 'running' changes\n  --\n  local expired = redis.call('zrangebyscore', job_expirations_key, '-inf', '('..now)\n\n  if #expired > 0 then\n    redis.call('zremrangebyscore', job_expirations_key, '-inf', '('..now)\n\n    local flush_batch = function (batch, acc)\n      local weights = redis.call('hmget', job_weights_key, unpack(batch))\n                      redis.call('hdel',  job_weights_key, unpack(batch))\n      local clients = redis.call('hmget', job_clients_key, unpack(batch))\n                      redis.call('hdel',  job_clients_key, unpack(batch))\n\n      -- Calculate sum of removed weights\n      for i = 1, #weights do\n        acc['total'] = acc['total'] + (tonumber(weights[i]) or 0)\n      end\n\n      -- Calculate sum of removed weights by client\n      local client_weights = {}\n      for i = 1, #clients do\n        local removed = tonumber(weights[i]) or 0\n        if removed > 0 then\n          acc['client_weights'][clients[i]] = (acc['client_weights'][clients[i]] or 0) + removed\n        end\n      end\n    end\n\n    local acc = {\n      ['total'] = 0,\n      ['client_weights'] = {}\n    }\n    local batch_size = 1000\n\n    -- Compute changes to Zsets and apply changes to Hashes\n    for i = 1, #expired, batch_size do\n      local batch = {}\n      for j = i, math.min(i + batch_size - 1, #expired) do\n        table.insert(batch, expired[j])\n      end\n\n      flush_batch(batch, acc)\n    end\n\n    -- Apply changes to Zsets\n    if acc['total'] > 0 then\n      redis.call('hincrby', settings_key, 'done', acc['total'])\n      running = tonumber(redis.call('hincrby', settings_key, 'running', -acc['total']))\n    end\n\n    for client, weight in pairs(acc['client_weights']) do\n      redis.call('zincrby', client_running_key, -weight, client)\n    end\n  end\n\n  --\n  -- Process 'reservoir' changes\n  --\n  local reservoirRefreshActive = reservoirRefreshInterval ~= nil and reservoirRefreshAmount ~= nil\n  if reservoirRefreshActive and now >= lastReservoirRefresh + reservoirRefreshInterval then\n    reservoir = reservoirRefreshAmount\n    redis.call('hmset', settings_key,\n      'reservoir', reservoir,\n      'lastReservoirRefresh', now\n    )\n  end\n\n  local reservoirIncreaseActive = reservoirIncreaseInterval ~= nil and reservoirIncreaseAmount ~= nil\n  if reservoirIncreaseActive and now >= lastReservoirIncrease + reservoirIncreaseInterval then\n    local num_intervals = math.floor((now - lastReservoirIncrease) / reservoirIncreaseInterval)\n    local incr = reservoirIncreaseAmount * num_intervals\n    if reservoirIncreaseMaximum ~= nil then\n      incr = math.min(incr, reservoirIncreaseMaximum - (reservoir or 0))\n    end\n    if incr > 0 then\n      reservoir = (reservoir or 0) + incr\n    end\n    redis.call('hmset', settings_key,\n      'reservoir', reservoir,\n      'lastReservoirIncrease', lastReservoirIncrease + (num_intervals * reservoirIncreaseInterval)\n    )\n  end\n\n  --\n  -- Clear unresponsive clients\n  --\n  local unresponsive = redis.call('zrangebyscore', client_last_seen_key, '-inf', (now - clientTimeout))\n  local unresponsive_lookup = {}\n  local terminated_clients = {}\n  for i = 1, #unresponsive do\n    unresponsive_lookup[unresponsive[i]] = true\n    if tonumber(redis.call('zscore', client_running_key, unresponsive[i])) == 0 then\n      table.insert(terminated_clients, unresponsive[i])\n    end\n  end\n  if #terminated_clients > 0 then\n    redis.call('zrem', client_running_key,         unpack(terminated_clients))\n    redis.call('hdel', client_num_queued_key,      unpack(terminated_clients))\n    redis.call('zrem', client_last_registered_key, unpack(terminated_clients))\n    redis.call('zrem', client_last_seen_key,       unpack(terminated_clients))\n  end\n\n  --\n  -- Broadcast capacity changes\n  --\n  local final_capacity = compute_capacity(maxConcurrent, running, reservoir)\n\n  if always_publish or (initial_capacity ~= nil and final_capacity == nil) then\n    -- always_publish or was not unlimited, now unlimited\n    redis.call('publish', 'b_'..id, 'capacity:'..(final_capacity or ''))\n\n  elseif initial_capacity ~= nil and final_capacity ~= nil and final_capacity > initial_capacity then\n    -- capacity was increased\n    -- send the capacity message to the limiter having the lowest number of running jobs\n    -- the tiebreaker is the limiter having not registered a job in the longest time\n\n    local lowest_concurrency_value = nil\n    local lowest_concurrency_clients = {}\n    local lowest_concurrency_last_registered = {}\n    local client_concurrencies = redis.call('zrange', client_running_key, 0, -1, 'withscores')\n\n    for i = 1, #client_concurrencies, 2 do\n      local client = client_concurrencies[i]\n      local concurrency = tonumber(client_concurrencies[i+1])\n\n      if (\n        lowest_concurrency_value == nil or lowest_concurrency_value == concurrency\n      ) and (\n        not unresponsive_lookup[client]\n      ) and (\n        tonumber(redis.call('hget', client_num_queued_key, client)) > 0\n      ) then\n        lowest_concurrency_value = concurrency\n        table.insert(lowest_concurrency_clients, client)\n        local last_registered = tonumber(redis.call('zscore', client_last_registered_key, client))\n        table.insert(lowest_concurrency_last_registered, last_registered)\n      end\n    end\n\n    if #lowest_concurrency_clients > 0 then\n      local position = 1\n      local earliest = lowest_concurrency_last_registered[1]\n\n      for i,v in ipairs(lowest_concurrency_last_registered) do\n        if v < earliest then\n          position = i\n          earliest = v\n        end\n      end\n\n      local next_client = lowest_concurrency_clients[position]\n      redis.call('publish', 'b_'..id,\n        'capacity-priority:'..(final_capacity or '')..\n        ':'..next_client..\n        ':'..capacityPriorityCounter\n      )\n      redis.call('hincrby', settings_key, 'capacityPriorityCounter', '1')\n    else\n      redis.call('publish', 'b_'..id, 'capacity:'..(final_capacity or ''))\n    end\n  end\n\n  return {\n    ['capacity'] = final_capacity,\n    ['running'] = running,\n    ['reservoir'] = reservoir\n  }\nend\n",
        "queued.lua": "local clientTimeout = tonumber(redis.call('hget', settings_key, 'clientTimeout'))\nlocal valid_clients = redis.call('zrangebyscore', client_last_seen_key, (now - clientTimeout), 'inf')\nlocal client_queued = redis.call('hmget', client_num_queued_key, unpack(valid_clients))\n\nlocal sum = 0\nfor i = 1, #client_queued do\n  sum = sum + tonumber(client_queued[i])\nend\n\nreturn sum\n",
        "refresh_expiration.lua": "local refresh_expiration = function (now, nextRequest, groupTimeout)\n\n  if groupTimeout ~= nil then\n    local ttl = (nextRequest + groupTimeout) - now\n\n    for i = 1, #KEYS do\n      redis.call('pexpire', KEYS[i], ttl)\n    end\n  end\n\nend\n",
        "refs.lua": "local settings_key = KEYS[1]\nlocal job_weights_key = KEYS[2]\nlocal job_expirations_key = KEYS[3]\nlocal job_clients_key = KEYS[4]\nlocal client_running_key = KEYS[5]\nlocal client_num_queued_key = KEYS[6]\nlocal client_last_registered_key = KEYS[7]\nlocal client_last_seen_key = KEYS[8]\n\nlocal now = tonumber(ARGV[1])\nlocal client = ARGV[2]\n\nlocal num_static_argv = 2\n",
        "register.lua": "local index = ARGV[num_static_argv + 1]\nlocal weight = tonumber(ARGV[num_static_argv + 2])\nlocal expiration = tonumber(ARGV[num_static_argv + 3])\n\nlocal state = process_tick(now, false)\nlocal capacity = state['capacity']\nlocal reservoir = state['reservoir']\n\nlocal settings = redis.call('hmget', settings_key,\n  'nextRequest',\n  'minTime',\n  'groupTimeout'\n)\nlocal nextRequest = tonumber(settings[1])\nlocal minTime = tonumber(settings[2])\nlocal groupTimeout = tonumber(settings[3])\n\nif conditions_check(capacity, weight) then\n\n  redis.call('hincrby', settings_key, 'running', weight)\n  redis.call('hset', job_weights_key, index, weight)\n  if expiration ~= nil then\n    redis.call('zadd', job_expirations_key, now + expiration, index)\n  end\n  redis.call('hset', job_clients_key, index, client)\n  redis.call('zincrby', client_running_key, weight, client)\n  redis.call('hincrby', client_num_queued_key, client, -1)\n  redis.call('zadd', client_last_registered_key, now, client)\n\n  local wait = math.max(nextRequest - now, 0)\n  local newNextRequest = now + wait + minTime\n\n  if reservoir == nil then\n    redis.call('hset', settings_key,\n      'nextRequest', newNextRequest\n    )\n  else\n    reservoir = reservoir - weight\n    redis.call('hmset', settings_key,\n      'reservoir', reservoir,\n      'nextRequest', newNextRequest\n    )\n  end\n\n  refresh_expiration(now, newNextRequest, groupTimeout)\n\n  return {true, wait, reservoir}\n\nelse\n  return {false}\nend\n",
        "register_client.lua": "local queued = tonumber(ARGV[num_static_argv + 1])\n\n-- Could have been re-registered concurrently\nif not redis.call('zscore', client_last_seen_key, client) then\n  redis.call('zadd', client_running_key, 0, client)\n  redis.call('hset', client_num_queued_key, client, queued)\n  redis.call('zadd', client_last_registered_key, 0, client)\nend\n\nredis.call('zadd', client_last_seen_key, now, client)\n\nreturn {}\n",
        "running.lua": "return process_tick(now, false)['running']\n",
        "submit.lua": "local queueLength = tonumber(ARGV[num_static_argv + 1])\nlocal weight = tonumber(ARGV[num_static_argv + 2])\n\nlocal capacity = process_tick(now, false)['capacity']\n\nlocal settings = redis.call('hmget', settings_key,\n  'id',\n  'maxConcurrent',\n  'highWater',\n  'nextRequest',\n  'strategy',\n  'unblockTime',\n  'penalty',\n  'minTime',\n  'groupTimeout'\n)\nlocal id = settings[1]\nlocal maxConcurrent = tonumber(settings[2])\nlocal highWater = tonumber(settings[3])\nlocal nextRequest = tonumber(settings[4])\nlocal strategy = tonumber(settings[5])\nlocal unblockTime = tonumber(settings[6])\nlocal penalty = tonumber(settings[7])\nlocal minTime = tonumber(settings[8])\nlocal groupTimeout = tonumber(settings[9])\n\nif maxConcurrent ~= nil and weight > maxConcurrent then\n  return redis.error_reply('OVERWEIGHT:'..weight..':'..maxConcurrent)\nend\n\nlocal reachedHWM = (highWater ~= nil and queueLength == highWater\n  and not (\n    conditions_check(capacity, weight)\n    and nextRequest - now <= 0\n  )\n)\n\nlocal blocked = strategy == 3 and (reachedHWM or unblockTime >= now)\n\nif blocked then\n  local computedPenalty = penalty\n  if computedPenalty == nil then\n    if minTime == 0 then\n      computedPenalty = 5000\n    else\n      computedPenalty = 15 * minTime\n    end\n  end\n\n  local newNextRequest = now + computedPenalty + minTime\n\n  redis.call('hmset', settings_key,\n    'unblockTime', now + computedPenalty,\n    'nextRequest', newNextRequest\n  )\n\n  local clients_queued_reset = redis.call('hkeys', client_num_queued_key)\n  local queued_reset = {}\n  for i = 1, #clients_queued_reset do\n    table.insert(queued_reset, clients_queued_reset[i])\n    table.insert(queued_reset, 0)\n  end\n  redis.call('hmset', client_num_queued_key, unpack(queued_reset))\n\n  redis.call('publish', 'b_'..id, 'blocked:')\n\n  refresh_expiration(now, newNextRequest, groupTimeout)\nend\n\nif not blocked and not reachedHWM then\n  redis.call('hincrby', client_num_queued_key, client, 1)\nend\n\nreturn {reachedHWM, blocked, strategy}\n",
        "update_settings.lua": "local args = {'hmset', settings_key}\n\nfor i = num_static_argv + 1, #ARGV do\n  table.insert(args, ARGV[i])\nend\n\nredis.call(unpack(args))\n\nprocess_tick(now, true)\n\nlocal groupTimeout = tonumber(redis.call('hget', settings_key, 'groupTimeout'))\nrefresh_expiration(0, 0, groupTimeout)\n\nreturn {}\n",
        "validate_client.lua": "if not redis.call('zscore', client_last_seen_key, client) then\n  return redis.error_reply('UNKNOWN_CLIENT')\nend\n\nredis.call('zadd', client_last_seen_key, now, client)\n",
        "validate_keys.lua": "if not (redis.call('exists', settings_key) == 1) then\n  return redis.error_reply('SETTINGS_KEY_NOT_FOUND')\nend\n"
    },
    exports, headers, lua, templates, Events$4, RedisConnection$2, Scripts$2, parser$5;

function asyncGeneratorStep$5(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$5(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$5(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$5(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
exports = Scripts$3, headers = {
    refs: (lua = require$$0)["refs.lua"],
    validate_keys: lua["validate_keys.lua"],
    validate_client: lua["validate_client.lua"],
    refresh_expiration: lua["refresh_expiration.lua"],
    process_tick: lua["process_tick.lua"],
    conditions_check: lua["conditions_check.lua"],
    get_time: lua["get_time.lua"]
}, exports.allKeys = function (e) {
    return [`b_${e}_settings`, `b_${e}_job_weights`, `b_${e}_job_expirations`, `b_${e}_job_clients`, `b_${e}_client_running`, `b_${e}_client_num_queued`, `b_${e}_client_last_registered`, `b_${e}_client_last_seen`]
}, templates = {
    init: {
        keys: exports.allKeys,
        headers: ["process_tick"],
        refresh_expiration: !0,
        code: lua["init.lua"]
    },
    group_check: {
        keys: exports.allKeys,
        headers: [],
        refresh_expiration: !1,
        code: lua["group_check.lua"]
    },
    register_client: {
        keys: exports.allKeys,
        headers: ["validate_keys"],
        refresh_expiration: !1,
        code: lua["register_client.lua"]
    },
    blacklist_client: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client"],
        refresh_expiration: !1,
        code: lua["blacklist_client.lua"]
    },
    heartbeat: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !1,
        code: lua["heartbeat.lua"]
    },
    update_settings: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !0,
        code: lua["update_settings.lua"]
    },
    running: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !1,
        code: lua["running.lua"]
    },
    queued: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client"],
        refresh_expiration: !1,
        code: lua["queued.lua"]
    },
    done: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !1,
        code: lua["done.lua"]
    },
    check: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick", "conditions_check"],
        refresh_expiration: !1,
        code: lua["check.lua"]
    },
    submit: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick", "conditions_check"],
        refresh_expiration: !0,
        code: lua["submit.lua"]
    },
    register: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick", "conditions_check"],
        refresh_expiration: !0,
        code: lua["register.lua"]
    },
    free: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !0,
        code: lua["free.lua"]
    },
    current_reservoir: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !1,
        code: lua["current_reservoir.lua"]
    },
    increment_reservoir: {
        keys: exports.allKeys,
        headers: ["validate_keys", "validate_client", "process_tick"],
        refresh_expiration: !0,
        code: lua["increment_reservoir.lua"]
    }
}, exports.names = Object.keys(templates), exports.keys = function (e, t) {
    return templates[e].keys(t)
}, exports.payload = function (e) {
    var t;
    return t = templates[e], Array.prototype.concat(headers.refs, t.headers.map((function (e) {
        return headers[e]
    })), t.refresh_expiration ? headers.refresh_expiration : "", t.code).join("\n")
}, parser$5 = parser$8, Events$4 = Events_1, Scripts$2 = Scripts$3, RedisConnection$2 = function () {
    class RedisConnection {
        constructor(options = {}) {
            parser$5.load(options, this.defaults, this), null == this.Redis && (this.Redis = eval("require")("redis")), null == this.Events && (this.Events = new Events$4(this)), this.terminated = !1, null == this.client && (this.client = this.Redis.createClient(this.clientOptions)), this.subscriber = this.client.duplicate(), this.limiters = {}, this.shas = {}, this.ready = this.Promise.all([this._setup(this.client, !1), this._setup(this.subscriber, !0)]).then((() => this._loadScripts())).then((() => ({
                client: this.client,
                subscriber: this.subscriber
            })))
        }
        _setup(e, t) {
            return e.setMaxListeners(0), new this.Promise(((n, r) => (e.on("error", (e => this.Events.trigger("error", e))), t && e.on("message", ((e, t) => {
                var n;
                return null != (n = this.limiters[e]) ? n._store.onMessage(e, t) : void 0
            })), e.ready ? n() : e.once("ready", n))))
        }
        _loadScript(e) {
            return new this.Promise(((t, n) => {
                var r;
                return r = Scripts$2.payload(e), this.client.multi([
                    ["script", "load", r]
                ]).exec(((r, i) => null != r ? n(r) : (this.shas[e] = i[0], t(i[0]))))
            }))
        }
        _loadScripts() {
            return this.Promise.all(Scripts$2.names.map((e => this._loadScript(e))))
        }
        __runCommand__(e) {
            var t = this;
            return _asyncToGenerator$5((function* () {
                return yield t.ready, new t.Promise(((n, r) => t.client.multi([e]).exec_atomic((function (e, t) {
                    return null != e ? r(e) : n(t[0])
                }))))
            }))()
        }
        __addLimiter__(e) {
            return this.Promise.all([e.channel(), e.channel_client()].map((t => new this.Promise(((n, r) => {
                var i;
                return i = r => {
                    if (r === t) return this.subscriber.removeListener("subscribe", i), this.limiters[t] = e, n()
                }, this.subscriber.on("subscribe", i), this.subscriber.subscribe(t)
            })))))
        }
        __removeLimiter__(e) {
            var t = this;
            return this.Promise.all([e.channel(), e.channel_client()].map(function () {
                var e = _asyncToGenerator$5((function* (e) {
                    return t.terminated || (yield new t.Promise(((n, r) => t.subscriber.unsubscribe(e, (function (t, i) {
                        return null != t ? r(t) : i === e ? n() : void 0
                    }))))), delete t.limiters[e]
                }));
                return function (t) {
                    return e.apply(this, arguments)
                }
            }()))
        }
        __scriptArgs__(e, t, n, r) {
            var i;
            return i = Scripts$2.keys(e, t), [this.shas[e], i.length].concat(i, n, r)
        }
        __scriptFn__(e) {
            return this.client.evalsha.bind(this.client)
        }
        disconnect(e = !0) {
            var t, n, r, i;
            for (t = 0, r = (i = Object.keys(this.limiters)).length; t < r; t++) n = i[t], clearInterval(this.limiters[n]._store.heartbeat);
            return this.limiters = {}, this.terminated = !0, this.client.end(e), this.subscriber.end(e), this.Promise.resolve()
        }
    }
    return RedisConnection.prototype.datastore = "redis", RedisConnection.prototype.defaults = {
        Redis: null,
        clientOptions: {},
        client: null,
        Promise: Promise,
        Events: null
    }, RedisConnection
}.call(void 0);
var RedisConnection_1 = RedisConnection$2,
    Events$3, IORedisConnection$2, Scripts$1, parser$4;

function _slicedToArray$3(e, t) {
    return _arrayWithHoles$3(e) || _iterableToArrayLimit$3(e, t) || _nonIterableRest$3()
}

function _nonIterableRest$3() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit$3(e, t) {
    var n = [],
        r = !0,
        i = !1,
        s = void 0;
    try {
        for (var o, a = e[Symbol.iterator](); !(r = (o = a.next()).done) && (n.push(o.value), !t || n.length !== t); r = !0);
    } catch (e) {
        i = !0, s = e
    } finally {
        try {
            r || null == a.return || a.return()
        } finally {
            if (i) throw s
        }
    }
    return n
}

function _arrayWithHoles$3(e) {
    if (Array.isArray(e)) return e
}

function asyncGeneratorStep$4(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$4(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$4(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$4(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
parser$4 = parser$8, Events$3 = Events_1, Scripts$1 = Scripts$3, IORedisConnection$2 = function () {
    class IORedisConnection {
        constructor(options = {}) {
            parser$4.load(options, this.defaults, this), null == this.Redis && (this.Redis = eval("require")("ioredis")), null == this.Events && (this.Events = new Events$3(this)), this.terminated = !1, null != this.clusterNodes ? (this.client = new this.Redis.Cluster(this.clusterNodes, this.clientOptions), this.subscriber = new this.Redis.Cluster(this.clusterNodes, this.clientOptions)) : null != this.client && null == this.client.duplicate ? this.subscriber = new this.Redis.Cluster(this.client.startupNodes, this.client.options) : (null == this.client && (this.client = new this.Redis(this.clientOptions)), this.subscriber = this.client.duplicate()), this.limiters = {}, this.ready = this.Promise.all([this._setup(this.client, !1), this._setup(this.subscriber, !0)]).then((() => (this._loadScripts(), {
                client: this.client,
                subscriber: this.subscriber
            })))
        }
        _setup(e, t) {
            return e.setMaxListeners(0), new this.Promise(((n, r) => (e.on("error", (e => this.Events.trigger("error", e))), t && e.on("message", ((e, t) => {
                var n;
                return null != (n = this.limiters[e]) ? n._store.onMessage(e, t) : void 0
            })), "ready" === e.status ? n() : e.once("ready", n))))
        }
        _loadScripts() {
            return Scripts$1.names.forEach((e => this.client.defineCommand(e, {
                lua: Scripts$1.payload(e)
            })))
        }
        __runCommand__(e) {
            var t = this;
            return _asyncToGenerator$4((function* () {
                yield t.ready;
                var n = _slicedToArray$3(yield t.client.pipeline([e]).exec(), 1);
                return _slicedToArray$3(n[0], 2)[1]
            }))()
        }
        __addLimiter__(e) {
            return this.Promise.all([e.channel(), e.channel_client()].map((t => new this.Promise(((n, r) => this.subscriber.subscribe(t, (() => (this.limiters[t] = e, n()))))))))
        }
        __removeLimiter__(e) {
            var t = this;
            return [e.channel(), e.channel_client()].forEach(function () {
                var e = _asyncToGenerator$4((function* (e) {
                    return t.terminated || (yield t.subscriber.unsubscribe(e)), delete t.limiters[e]
                }));
                return function (t) {
                    return e.apply(this, arguments)
                }
            }())
        }
        __scriptArgs__(e, t, n, r) {
            var i;
            return [(i = Scripts$1.keys(e, t)).length].concat(i, n, r)
        }
        __scriptFn__(e) {
            return this.client[e].bind(this.client)
        }
        disconnect(e = !0) {
            var t, n, r, i;
            for (t = 0, r = (i = Object.keys(this.limiters)).length; t < r; t++) n = i[t], clearInterval(this.limiters[n]._store.heartbeat);
            return this.limiters = {}, this.terminated = !0, e ? this.Promise.all([this.client.quit(), this.subscriber.quit()]) : (this.client.disconnect(), this.subscriber.disconnect(), this.Promise.resolve())
        }
    }
    return IORedisConnection.prototype.datastore = "ioredis", IORedisConnection.prototype.defaults = {
        Redis: null,
        clientOptions: {},
        clusterNodes: null,
        client: null,
        Promise: Promise,
        Events: null
    }, IORedisConnection
}.call(void 0);
var IORedisConnection_1 = IORedisConnection$2,
    BottleneckError$1, IORedisConnection$1, RedisConnection$1, RedisDatastore$1, parser$3;

function _slicedToArray$2(e, t) {
    return _arrayWithHoles$2(e) || _iterableToArrayLimit$2(e, t) || _nonIterableRest$2()
}

function _nonIterableRest$2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit$2(e, t) {
    var n = [],
        r = !0,
        i = !1,
        s = void 0;
    try {
        for (var o, a = e[Symbol.iterator](); !(r = (o = a.next()).done) && (n.push(o.value), !t || n.length !== t); r = !0);
    } catch (e) {
        i = !0, s = e
    } finally {
        try {
            r || null == a.return || a.return()
        } finally {
            if (i) throw s
        }
    }
    return n
}

function _arrayWithHoles$2(e) {
    if (Array.isArray(e)) return e
}

function asyncGeneratorStep$3(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$3(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$3(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$3(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
parser$3 = parser$8, BottleneckError$1 = BottleneckError_1, RedisConnection$1 = RedisConnection_1, IORedisConnection$1 = IORedisConnection_1, RedisDatastore$1 = class {
    constructor(e, t, n) {
        this.instance = e, this.storeOptions = t, this.originalId = this.instance.id, this.clientId = this.instance._randomIndex(), parser$3.load(n, n, this), this.clients = {}, this.capacityPriorityCounters = {}, this.sharedConnection = null != this.connection, null == this.connection && (this.connection = "redis" === this.instance.datastore ? new RedisConnection$1({
            Redis: this.Redis,
            clientOptions: this.clientOptions,
            Promise: this.Promise,
            Events: this.instance.Events
        }) : "ioredis" === this.instance.datastore ? new IORedisConnection$1({
            Redis: this.Redis,
            clientOptions: this.clientOptions,
            clusterNodes: this.clusterNodes,
            Promise: this.Promise,
            Events: this.instance.Events
        }) : void 0), this.instance.connection = this.connection, this.instance.datastore = this.connection.datastore, this.ready = this.connection.ready.then((e => (this.clients = e, this.runScript("init", this.prepareInitSettings(this.clearDatastore))))).then((() => this.connection.__addLimiter__(this.instance))).then((() => this.runScript("register_client", [this.instance.queued()]))).then((() => {
            var e;
            return "function" == typeof (e = this.heartbeat = setInterval((() => this.runScript("heartbeat", []).catch((e => this.instance.Events.trigger("error", e)))), this.heartbeatInterval)).unref && e.unref(), this.clients
        }))
    }
    __publish__(e) {
        var t = this;
        return _asyncToGenerator$3((function* () {
            return (yield t.ready).client.publish(t.instance.channel(), `message:${e.toString()}`)
        }))()
    }
    onMessage(e, t) {
        var n = this;
        return _asyncToGenerator$3((function* () {
            var e, r, i, s, o, a, l, c, u, h;
            try {
                l = t.indexOf(":");
                var _ = [t.slice(0, l), t.slice(l + 1)];
                if (i = _[1], "capacity" === (h = _[0])) return yield n.instance._drainAll(i.length > 0 ? ~~i : void 0);
                if ("capacity-priority" === h) {
                    var d = _slicedToArray$2(i.split(":"), 3);
                    return u = d[0], c = d[1], r = d[2], e = u.length > 0 ? ~~u : void 0, c === n.clientId ? (s = yield n.instance._drainAll(e), a = null != e ? e - (s || 0) : "", yield n.clients.client.publish(n.instance.channel(), `capacity-priority:${a}::${r}`)) : "" === c ? (clearTimeout(n.capacityPriorityCounters[r]), delete n.capacityPriorityCounters[r], n.instance._drainAll(e)) : n.capacityPriorityCounters[r] = setTimeout(_asyncToGenerator$3((function* () {
                        var t;
                        try {
                            return delete n.capacityPriorityCounters[r], yield n.runScript("blacklist_client", [c]), yield n.instance._drainAll(e)
                        } catch (e) {
                            return t = e, n.instance.Events.trigger("error", t)
                        }
                    })), 1e3)
                }
                if ("message" === h) return n.instance.Events.trigger("message", i);
                if ("blocked" === h) return yield n.instance._dropAllQueued()
            } catch (e) {
                return o = e, n.instance.Events.trigger("error", o)
            }
        }))()
    }
    __disconnect__(e) {
        return clearInterval(this.heartbeat), this.sharedConnection ? this.connection.__removeLimiter__(this.instance) : this.connection.disconnect(e)
    }
    runScript(e, t) {
        var n = this;
        return _asyncToGenerator$3((function* () {
            return "init" !== e && "register_client" !== e && (yield n.ready), new n.Promise(((r, i) => {
                var s, o;
                return s = [Date.now(), n.clientId].concat(t), n.instance.Events.trigger("debug", `Calling Redis script: ${e}.lua`, s), o = n.connection.__scriptArgs__(e, n.originalId, s, (function (e, t) {
                    return null != e ? i(e) : r(t)
                })), n.connection.__scriptFn__(e)(...o)
            })).catch((r => "SETTINGS_KEY_NOT_FOUND" === r.message ? "heartbeat" === e ? n.Promise.resolve() : n.runScript("init", n.prepareInitSettings(!1)).then((() => n.runScript(e, t))) : "UNKNOWN_CLIENT" === r.message ? n.runScript("register_client", [n.instance.queued()]).then((() => n.runScript(e, t))) : n.Promise.reject(r)))
        }))()
    }
    prepareArray(e) {
        var t, n, r, i;
        for (r = [], t = 0, n = e.length; t < n; t++) i = e[t], r.push(null != i ? i.toString() : "");
        return r
    }
    prepareObject(e) {
        var t, n, r;
        for (n in t = [], e) r = e[n], t.push(n, null != r ? r.toString() : "");
        return t
    }
    prepareInitSettings(e) {
        var t;
        return (t = this.prepareObject(Object.assign({}, this.storeOptions, {
            id: this.originalId,
            version: this.instance.version,
            groupTimeout: this.timeout,
            clientTimeout: this.clientTimeout
        }))).unshift(e ? 1 : 0, this.instance.version), t
    }
    convertBool(e) {
        return !!e
    }
    __updateSettings__(e) {
        var t = this;
        return _asyncToGenerator$3((function* () {
            return yield t.runScript("update_settings", t.prepareObject(e)), parser$3.overwrite(e, e, t.storeOptions)
        }))()
    }
    __running__() {
        return this.runScript("running", [])
    }
    __queued__() {
        return this.runScript("queued", [])
    }
    __done__() {
        return this.runScript("done", [])
    }
    __groupCheck__() {
        var e = this;
        return _asyncToGenerator$3((function* () {
            return e.convertBool(yield e.runScript("group_check", []))
        }))()
    }
    __incrementReservoir__(e) {
        return this.runScript("increment_reservoir", [e])
    }
    __currentReservoir__() {
        return this.runScript("current_reservoir", [])
    }
    __check__(e) {
        var t = this;
        return _asyncToGenerator$3((function* () {
            return t.convertBool(yield t.runScript("check", t.prepareArray([e])))
        }))()
    }
    __register__(e, t, n) {
        var r = this;
        return _asyncToGenerator$3((function* () {
            var i, s, o, a = _slicedToArray$2(yield r.runScript("register", r.prepareArray([e, t, n])), 3);
            return s = a[0], o = a[1], i = a[2], {
                success: r.convertBool(s),
                wait: o,
                reservoir: i
            }
        }))()
    }
    __submit__(e, t) {
        var n = this;
        return _asyncToGenerator$3((function* () {
            var r, i, s, o, a;
            try {
                var l = _slicedToArray$2(yield n.runScript("submit", n.prepareArray([e, t])), 3);
                return o = l[0], r = l[1], a = l[2], {
                    reachedHWM: n.convertBool(o),
                    blocked: n.convertBool(r),
                    strategy: a
                }
            } catch (e) {
                if (0 === (i = e).message.indexOf("OVERWEIGHT")) {
                    var c = _slicedToArray$2(i.message.split(":"), 3);
                    throw t = c[1], s = c[2], new BottleneckError$1(`Impossible to add a job having a weight of ${t} to a limiter having a maxConcurrent setting of ${s}`)
                }
                throw i
            }
        }))()
    }
    __free__(e, t) {
        var n = this;
        return _asyncToGenerator$3((function* () {
            return {
                running: yield n.runScript("free", n.prepareArray([e]))
            }
        }))()
    }
};
var RedisDatastore_1 = RedisDatastore$1,
    BottleneckError, States$1;
BottleneckError = BottleneckError_1, States$1 = class {
    constructor(e) {
        this.status = e, this._jobs = {}, this.counts = this.status.map((function () {
            return 0
        }))
    }
    next(e) {
        var t, n;
        return n = (t = this._jobs[e]) + 1, null != t && n < this.status.length ? (this.counts[t]--, this.counts[n]++, this._jobs[e]++) : null != t ? (this.counts[t]--, delete this._jobs[e]) : void 0
    }
    start(e) {
        return 0, this._jobs[e] = 0, this.counts[0]++
    }
    remove(e) {
        var t;
        return null != (t = this._jobs[e]) && (this.counts[t]--, delete this._jobs[e]), null != t
    }
    jobStatus(e) {
        var t;
        return null != (t = this.status[this._jobs[e]]) ? t : null
    }
    statusJobs(e) {
        var t, n, r, i;
        if (null != e) {
            if ((n = this.status.indexOf(e)) < 0) throw new BottleneckError(`status must be one of ${this.status.join(", ")}`);
            for (t in i = [], r = this._jobs) r[t] === n && i.push(t);
            return i
        }
        return Object.keys(this._jobs)
    }
    statusCounts() {
        return this.counts.reduce(((e, t, n) => (e[this.status[n]] = t, e)), {})
    }
};
var States_1 = States$1,
    DLList, Sync$1;

function asyncGeneratorStep$2(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$2(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$2(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$2(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
DLList = DLList_1, Sync$1 = class {
    constructor(e, t) {
        this.schedule = this.schedule.bind(this), this.name = e, this.Promise = t, this._running = 0, this._queue = new DLList
    }
    isEmpty() {
        return 0 === this._queue.length
    }
    _tryToRun() {
        var e = this;
        return _asyncToGenerator$2((function* () {
            var t, n, r, i, s, o, a;
            if (e._running < 1 && e._queue.length > 0) {
                e._running++;
                var l = e._queue.shift();
                return a = l.task, t = l.args, s = l.resolve, i = l.reject, n = yield _asyncToGenerator$2((function* () {
                    try {
                        return o = yield a(...t),
                            function () {
                                return s(o)
                            }
                    } catch (e) {
                        return r = e,
                            function () {
                                return i(r)
                            }
                    }
                }))(), e._running--, e._tryToRun(), n()
            }
        }))()
    }
    schedule(e, ...t) {
        var n, r, i;
        return i = r = null, n = new this.Promise((function (e, t) {
            return i = e, r = t
        })), this._queue.push({
            task: e,
            args: t,
            resolve: i,
            reject: r
        }), this._tryToRun(), n
    }
};
var Sync_1 = Sync$1,
    version = "2.19.5",
    require$$8 = {
        version: version
    },
    Events$2, Group, IORedisConnection, RedisConnection, Scripts, parser$2;

function _slicedToArray$1(e, t) {
    return _arrayWithHoles$1(e) || _iterableToArrayLimit$1(e, t) || _nonIterableRest$1()
}

function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit$1(e, t) {
    var n = [],
        r = !0,
        i = !1,
        s = void 0;
    try {
        for (var o, a = e[Symbol.iterator](); !(r = (o = a.next()).done) && (n.push(o.value), !t || n.length !== t); r = !0);
    } catch (e) {
        i = !0, s = e
    } finally {
        try {
            r || null == a.return || a.return()
        } finally {
            if (i) throw s
        }
    }
    return n
}

function _arrayWithHoles$1(e) {
    if (Array.isArray(e)) return e
}

function asyncGeneratorStep$1(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator$1(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep$1(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep$1(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
parser$2 = parser$8, Events$2 = Events_1, RedisConnection = RedisConnection_1, IORedisConnection = IORedisConnection_1, Scripts = Scripts$3, Group = function () {
    class e {
        constructor(e = {}) {
            this.deleteKey = this.deleteKey.bind(this), this.limiterOptions = e, parser$2.load(this.limiterOptions, this.defaults, this), this.Events = new Events$2(this), this.instances = {}, this.Bottleneck = Bottleneck_1, this._startAutoCleanup(), this.sharedConnection = null != this.connection, null == this.connection && ("redis" === this.limiterOptions.datastore ? this.connection = new RedisConnection(Object.assign({}, this.limiterOptions, {
                Events: this.Events
            })) : "ioredis" === this.limiterOptions.datastore && (this.connection = new IORedisConnection(Object.assign({}, this.limiterOptions, {
                Events: this.Events
            }))))
        }
        key(e = "") {
            var t;
            return null != (t = this.instances[e]) ? t : (() => {
                var t;
                return t = this.instances[e] = new this.Bottleneck(Object.assign(this.limiterOptions, {
                    id: `${this.id}-${e}`,
                    timeout: this.timeout,
                    connection: this.connection
                })), this.Events.trigger("created", t, e), t
            })()
        }
        deleteKey(e = "") {
            var t = this;
            return _asyncToGenerator$1((function* () {
                var n, r;
                return r = t.instances[e], t.connection && (n = yield t.connection.__runCommand__(["del", ...Scripts.allKeys(`${t.id}-${e}`)])), null != r && (delete t.instances[e], yield r.disconnect()), null != r || n > 0
            }))()
        }
        limiters() {
            var e, t, n, r;
            for (e in n = [], t = this.instances) r = t[e], n.push({
                key: e,
                limiter: r
            });
            return n
        }
        keys() {
            return Object.keys(this.instances)
        }
        clusterKeys() {
            var e = this;
            return _asyncToGenerator$1((function* () {
                var t, n, r, i, s, o, a, l;
                if (null == e.connection) return e.Promise.resolve(e.keys());
                for (o = [], t = null, l = `b_${e.id}-`.length, n = "_settings".length; 0 !== t;) {
                    var c = _slicedToArray$1(yield e.connection.__runCommand__(["scan", null != t ? t : 0, "match", `b_${e.id}-*_settings`, "count", 1e4]), 2);
                    for (t = ~~c[0], i = 0, a = (r = c[1]).length; i < a; i++) s = r[i], o.push(s.slice(l, -n))
                }
                return o
            }))()
        }
        _startAutoCleanup() {
            var e, t = this;
            return clearInterval(this.interval), "function" == typeof (e = this.interval = setInterval(_asyncToGenerator$1((function* () {
                var e, n, r, i, s, o;
                for (n in s = Date.now(), i = [], r = t.instances) {
                    o = r[n];
                    try {
                        (yield o._store.__groupCheck__(s)) ? i.push(t.deleteKey(n)): i.push(void 0)
                    } catch (t) {
                        e = t, i.push(o.Events.trigger("error", e))
                    }
                }
                return i
            })), this.timeout / 2)).unref ? e.unref() : void 0
        }
        updateSettings(e = {}) {
            if (parser$2.overwrite(e, this.defaults, this), parser$2.overwrite(e, e, this.limiterOptions), null != e.timeout) return this._startAutoCleanup()
        }
        disconnect(e = !0) {
            var t;
            if (!this.sharedConnection) return null != (t = this.connection) ? t.disconnect(e) : void 0
        }
    }
    return e.prototype.defaults = {
        timeout: 3e5,
        connection: null,
        Promise: Promise,
        id: "group-key"
    }, e
}.call(void 0);
var Group_1 = Group,
    Batcher, Events$1, parser$1;
parser$1 = parser$8, Events$1 = Events_1, Batcher = function () {
    class e {
        constructor(e = {}) {
            this.options = e, parser$1.load(this.options, this.defaults, this), this.Events = new Events$1(this), this._arr = [], this._resetPromise(), this._lastFlush = Date.now()
        }
        _resetPromise() {
            return this._promise = new this.Promise(((e, t) => this._resolve = e))
        }
        _flush() {
            return clearTimeout(this._timeout), this._lastFlush = Date.now(), this._resolve(), this.Events.trigger("batch", this._arr), this._arr = [], this._resetPromise()
        }
        add(e) {
            var t;
            return this._arr.push(e), t = this._promise, this._arr.length === this.maxSize ? this._flush() : null != this.maxTime && 1 === this._arr.length && (this._timeout = setTimeout((() => this._flush()), this.maxTime)), t
        }
    }
    return e.prototype.defaults = {
        maxTime: null,
        maxSize: null,
        Promise: Promise
    }, e
}.call(void 0);
var Batcher_1 = Batcher;

function _slicedToArray(e, t) {
    return _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _nonIterableRest()
}

function _iterableToArrayLimit(e, t) {
    var n = [],
        r = !0,
        i = !1,
        s = void 0;
    try {
        for (var o, a = e[Symbol.iterator](); !(r = (o = a.next()).done) && (n.push(o.value), !t || n.length !== t); r = !0);
    } catch (e) {
        i = !0, s = e
    } finally {
        try {
            r || null == a.return || a.return()
        } finally {
            if (i) throw s
        }
    }
    return n
}

function _toArray(e) {
    return _arrayWithHoles(e) || _iterableToArray(e) || _nonIterableRest()
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArray(e) {
    if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
}

function _arrayWithHoles(e) {
    if (Array.isArray(e)) return e
}

function asyncGeneratorStep(e, t, n, r, i, s, o) {
    try {
        var a = e[s](o),
            l = a.value
    } catch (e) {
        return void n(e)
    }
    a.done ? t(l) : Promise.resolve(l).then(r, i)
}

function _asyncToGenerator(e) {
    return function () {
        var t = this,
            n = arguments;
        return new Promise((function (r, i) {
            var s = e.apply(t, n);

            function o(e) {
                asyncGeneratorStep(s, r, i, o, a, "next", e)
            }

            function a(e) {
                asyncGeneratorStep(s, r, i, o, a, "throw", e)
            }
            o(void 0)
        }))
    }
}
var Bottleneck, DEFAULT_PRIORITY, Events, Job, LocalDatastore, NUM_PRIORITIES, Queues, RedisDatastore, States, Sync, parser, splice = [].splice;
NUM_PRIORITIES = 10, DEFAULT_PRIORITY = 5, parser = parser$8, Queues = Queues_1, Job = Job_1, LocalDatastore = LocalDatastore_1, RedisDatastore = RedisDatastore_1, Events = Events_1, States = States_1, Sync = Sync_1, Bottleneck = function () {
    class e {
        constructor(t = {}, ...n) {
            var r, i;
            this._addToQueue = this._addToQueue.bind(this), this._validateOptions(t, n), parser.load(t, this.instanceDefaults, this), this._queues = new Queues(NUM_PRIORITIES), this._scheduled = {}, this._states = new States(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : [])), this._limiter = null, this.Events = new Events(this), this._submitLock = new Sync("submit", this.Promise), this._registerLock = new Sync("register", this.Promise), i = parser.load(t, this.storeDefaults, {}), this._store = function () {
                if ("redis" === this.datastore || "ioredis" === this.datastore || null != this.connection) return r = parser.load(t, this.redisStoreDefaults, {}), new RedisDatastore(this, i, r);
                if ("local" === this.datastore) return r = parser.load(t, this.localStoreDefaults, {}), new LocalDatastore(this, i, r);
                throw new e.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`)
            }.call(this), this._queues.on("leftzero", (() => {
                var e;
                return null != (e = this._store.heartbeat) && "function" == typeof e.ref ? e.ref() : void 0
            })), this._queues.on("zero", (() => {
                var e;
                return null != (e = this._store.heartbeat) && "function" == typeof e.unref ? e.unref() : void 0
            }))
        }
        _validateOptions(t, n) {
            if (null == t || "object" != typeof t || 0 !== n.length) throw new e.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.")
        }
        ready() {
            return this._store.ready
        }
        clients() {
            return this._store.clients
        }
        channel() {
            return `b_${this.id}`
        }
        channel_client() {
            return `b_${this.id}_${this._store.clientId}`
        }
        publish(e) {
            return this._store.__publish__(e)
        }
        disconnect(e = !0) {
            return this._store.__disconnect__(e)
        }
        chain(e) {
            return this._limiter = e, this
        }
        queued(e) {
            return this._queues.queued(e)
        }
        clusterQueued() {
            return this._store.__queued__()
        }
        empty() {
            return 0 === this.queued() && this._submitLock.isEmpty()
        }
        running() {
            return this._store.__running__()
        }
        done() {
            return this._store.__done__()
        }
        jobStatus(e) {
            return this._states.jobStatus(e)
        }
        jobs(e) {
            return this._states.statusJobs(e)
        }
        counts() {
            return this._states.statusCounts()
        }
        _randomIndex() {
            return Math.random().toString(36).slice(2)
        }
        check(e = 1) {
            return this._store.__check__(e)
        }
        _clearGlobalState(e) {
            return null != this._scheduled[e] && (clearTimeout(this._scheduled[e].expiration), delete this._scheduled[e], !0)
        }
        _free(e, t, n, r) {
            var i = this;
            return _asyncToGenerator((function* () {
                var t, s;
                try {
                    if (s = (yield i._store.__free__(e, n.weight)).running, i.Events.trigger("debug", `Freed ${n.id}`, r), 0 === s && i.empty()) return i.Events.trigger("idle")
                } catch (e) {
                    return t = e, i.Events.trigger("error", t)
                }
            }))()
        }
        _run(e, t, n) {
            var r, i, s;
            return t.doRun(), r = this._clearGlobalState.bind(this, e), s = this._run.bind(this, e, t), i = this._free.bind(this, e, t), this._scheduled[e] = {
                timeout: setTimeout((() => t.doExecute(this._limiter, r, s, i)), n),
                expiration: null != t.options.expiration ? setTimeout((function () {
                    return t.doExpire(r, s, i)
                }), n + t.options.expiration) : void 0,
                job: t
            }
        }
        _drainOne(e) {
            return this._registerLock.schedule((() => {
                var t, n, r, i, s;
                if (0 === this.queued()) return this.Promise.resolve(null);
                s = this._queues.getFirst();
                var o = r = s.first();
                return i = o.options, t = o.args, null != e && i.weight > e ? this.Promise.resolve(null) : (this.Events.trigger("debug", `Draining ${i.id}`, {
                    args: t,
                    options: i
                }), n = this._randomIndex(), this._store.__register__(n, i.weight, i.expiration).then((({
                    success: e,
                    wait: o,
                    reservoir: a
                }) => {
                    var l;
                    return this.Events.trigger("debug", `Drained ${i.id}`, {
                        success: e,
                        args: t,
                        options: i
                    }), e ? (s.shift(), (l = this.empty()) && this.Events.trigger("empty"), 0 === a && this.Events.trigger("depleted", l), this._run(n, r, o), this.Promise.resolve(i.weight)) : this.Promise.resolve(null)
                })))
            }))
        }
        _drainAll(e, t = 0) {
            return this._drainOne(e).then((n => {
                var r;
                return null != n ? (r = null != e ? e - n : e, this._drainAll(r, t + n)) : this.Promise.resolve(t)
            })).catch((e => this.Events.trigger("error", e)))
        }
        _dropAllQueued(e) {
            return this._queues.shiftAll((function (t) {
                return t.doDrop({
                    message: e
                })
            }))
        }
        stop(t = {}) {
            var n, r;
            return t = parser.load(t, this.stopDefaults), r = e => {
                var t;
                return t = () => {
                    var t;
                    return (t = this._states.counts)[0] + t[1] + t[2] + t[3] === e
                }, new this.Promise(((e, n) => t() ? e() : this.on("done", (() => {
                    if (t()) return this.removeAllListeners("done"), e()
                }))))
            }, n = t.dropWaitingJobs ? (this._run = function (e, n) {
                return n.doDrop({
                    message: t.dropErrorMessage
                })
            }, this._drainOne = () => this.Promise.resolve(null), this._registerLock.schedule((() => this._submitLock.schedule((() => {
                var e, n, i;
                for (e in n = this._scheduled) i = n[e], "RUNNING" === this.jobStatus(i.job.options.id) && (clearTimeout(i.timeout), clearTimeout(i.expiration), i.job.doDrop({
                    message: t.dropErrorMessage
                }));
                return this._dropAllQueued(t.dropErrorMessage), r(0)
            }))))) : this.schedule({
                priority: NUM_PRIORITIES - 1,
                weight: 0
            }, (() => r(1))), this._receive = function (n) {
                return n._reject(new e.prototype.BottleneckError(t.enqueueErrorMessage))
            }, this.stop = () => this.Promise.reject(new e.prototype.BottleneckError("stop() has already been called")), n
        }
        _addToQueue(t) {
            var n = this;
            return _asyncToGenerator((function* () {
                var r, i, s, o, a, l, c;
                r = t.args, o = t.options;
                try {
                    var u = yield n._store.__submit__(n.queued(), o.weight);
                    a = u.reachedHWM, i = u.blocked, c = u.strategy
                } catch (e) {
                    return s = e, n.Events.trigger("debug", `Could not queue ${o.id}`, {
                        args: r,
                        options: o,
                        error: s
                    }), t.doDrop({
                        error: s
                    }), !1
                }
                return i ? (t.doDrop(), !0) : a && (null != (l = c === e.prototype.strategy.LEAK ? n._queues.shiftLastFrom(o.priority) : c === e.prototype.strategy.OVERFLOW_PRIORITY ? n._queues.shiftLastFrom(o.priority + 1) : c === e.prototype.strategy.OVERFLOW ? t : void 0) && l.doDrop(), null == l || c === e.prototype.strategy.OVERFLOW) ? (null == l && t.doDrop(), a) : (t.doQueue(a, i), n._queues.push(t), yield n._drainAll(), a)
            }))()
        }
        _receive(t) {
            return null != this._states.jobStatus(t.options.id) ? (t._reject(new e.prototype.BottleneckError(`A job with the same id already exists (id=${t.options.id})`)), !1) : (t.doReceive(), this._submitLock.schedule(this._addToQueue, t))
        }
        submit(...e) {
            var t, n, r, i, s, o, a, l, c;
            "function" == typeof e[0] ? (o = _toArray(e), n = o[0], e = o.slice(1), a = _slicedToArray(splice.call(e, -1), 1), t = a[0], i = parser.load({}, this.jobDefaults)) : (i = (l = _toArray(e))[0], n = l[1], e = l.slice(2), c = _slicedToArray(splice.call(e, -1), 1), t = c[0], i = parser.load(i, this.jobDefaults));
            return s = (...e) => new this.Promise((function (t, r) {
                return n(...e, (function (...e) {
                    return (null != e[0] ? r : t)(e)
                }))
            })), (r = new Job(s, e, i, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise)).promise.then((function (e) {
                return "function" == typeof t ? t(...e) : void 0
            })).catch((function (e) {
                return Array.isArray(e) ? "function" == typeof t ? t(...e) : void 0 : "function" == typeof t ? t(e) : void 0
            })), this._receive(r)
        }
        schedule(...e) {
            var t, n, r;
            if ("function" == typeof e[0]) {
                var i = _toArray(e);
                r = i[0], e = i.slice(1), n = {}
            } else {
                var s = _toArray(e);
                n = s[0], r = s[1], e = s.slice(2)
            }
            return t = new Job(r, e, n, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise), this._receive(t), t.promise
        }
        wrap(e) {
            var t, n;
            return t = this.schedule.bind(this), (n = function (...n) {
                return t(e.bind(this), ...n)
            }).withOptions = function (n, ...r) {
                return t(n, e, ...r)
            }, n
        }
        updateSettings(e = {}) {
            var t = this;
            return _asyncToGenerator((function* () {
                return yield t._store.__updateSettings__(parser.overwrite(e, t.storeDefaults)), parser.overwrite(e, t.instanceDefaults, t), t
            }))()
        }
        currentReservoir() {
            return this._store.__currentReservoir__()
        }
        incrementReservoir(e = 0) {
            return this._store.__incrementReservoir__(e)
        }
    }
    return e.default = e, e.Events = Events, e.version = e.prototype.version = require$$8.version, e.strategy = e.prototype.strategy = {
        LEAK: 1,
        OVERFLOW: 2,
        OVERFLOW_PRIORITY: 4,
        BLOCK: 3
    }, e.BottleneckError = e.prototype.BottleneckError = BottleneckError_1, e.Group = e.prototype.Group = Group_1, e.RedisConnection = e.prototype.RedisConnection = RedisConnection_1, e.IORedisConnection = e.prototype.IORedisConnection = IORedisConnection_1, e.Batcher = e.prototype.Batcher = Batcher_1, e.prototype.jobDefaults = {
        priority: DEFAULT_PRIORITY,
        weight: 1,
        expiration: null,
        id: "<no-id>"
    }, e.prototype.storeDefaults = {
        maxConcurrent: null,
        minTime: 0,
        highWater: null,
        strategy: e.prototype.strategy.LEAK,
        penalty: null,
        reservoir: null,
        reservoirRefreshInterval: null,
        reservoirRefreshAmount: null,
        reservoirIncreaseInterval: null,
        reservoirIncreaseAmount: null,
        reservoirIncreaseMaximum: null
    }, e.prototype.localStoreDefaults = {
        Promise: Promise,
        timeout: null,
        heartbeatInterval: 250
    }, e.prototype.redisStoreDefaults = {
        Promise: Promise,
        timeout: null,
        heartbeatInterval: 5e3,
        clientTimeout: 1e4,
        Redis: null,
        clientOptions: {},
        clusterNodes: null,
        clearDatastore: !1,
        connection: null
    }, e.prototype.instanceDefaults = {
        datastore: "local",
        connection: null,
        id: "<no-id>",
        rejectOnDrop: !0,
        trackDoneStatus: !1,
        Promise: Promise
    }, e.prototype.stopDefaults = {
        enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
        dropWaitingJobs: !0,
        dropErrorMessage: "This limiter has been stopped."
    }, e
}.call(void 0);
var Bottleneck_1 = Bottleneck,
    lib = Bottleneck_1;
export {
    lib as
    default
};
//# sourceMappingURL=/sm/36a0f62e948f2f4c0513048002d42e10ed3ae9734b9b9992c04744d5582cc660.map