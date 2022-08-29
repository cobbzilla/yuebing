const fs = require('fs')
const Queue = require('bull')
const system = require('../util/config').SYSTEM
const logger = system.logger

const XFORM_QUEUE_NAME = 'xform'
const XFORM_JOB_NAME = 'xform-job'
let JOB_QUEUE = null

const QUEUED_PATHS = {}

const redisConfig = system.privateConfig.redis
const MAX_CONCURRENCY = system.privateConfig.autoscan.concurrency

function initializeQueue (processFunction) {
  if (JOB_QUEUE === null) {
    JOB_QUEUE = new Queue(XFORM_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
    JOB_QUEUE.process(XFORM_JOB_NAME, MAX_CONCURRENCY, processFunction)

    JOB_QUEUE.on('active', (job, result) => {
      if (job.data.sourcePath) {
        logger.info(`jobQueue.on(active): job (${job.data.sourcePath}) STARTING with result=${JSON.stringify(result)}`)
      } else {
        logger.warn(`jobQueue.on(active): job (with missing data.sourcePath: ${JSON.stringify(job)}) STARTING with result=${JSON.stringify(result)}`)
      }
      job.data.jobStatus = { running: true }
      recordJobEvent(job, 'QUEUE_ACTIVE')
    })

    JOB_QUEUE.on('completed', (job, result) => {
      if (job.data.sourcePath) {
        logger.info(`jobQueue.on(completed): job (${job.data.sourcePath}) COMPLETED with result=${JSON.stringify(result)}`)
      } else {
        logger.warn(`jobQueue.on(completed): job (with missing data.sourcePath: ${JSON.stringify(job)}) COMPLETED with result=${JSON.stringify(result)}`)
      }
      recordJobEvent(job, 'QUEUE_COMPLETED')
      job.data.done = true
      job.data.jobStatus = { done: true, completed: true }
    })

    JOB_QUEUE.on('failed', (job, result) => {
      if (job.data.sourcePath) {
        logger.info(`jobQueue.on(failed): job (${job.data.sourcePath}) FAILED with result=${JSON.stringify(result)}`)
      } else {
        logger.info(`jobQueue.on(failed): job (with missing data.sourcePath: ${JSON.stringify(job)}) FAILED with result=${JSON.stringify(result)}`)
      }
      recordJobEvent(job, 'QUEUE_FAILED')
      job.data.done = true
      job.data.jobStatus = { done: true, failed: true }
    })
  }
  return JOB_QUEUE
}

const MAX_JOB_TIME = 1000 * 60 * 60 * 8 // 8 hours max time per job

function isQueued (sourcePath) {
  return typeof QUEUED_PATHS[sourcePath] === 'object'
}

function isStaleJob (sourcePath) {
  if (!isQueued(sourcePath)) {
    return false
  }
  const ctime = QUEUED_PATHS[sourcePath].ctime
  return Date.now() - ctime > MAX_JOB_TIME
}
function cdate (sourcePath) {
  return isQueued(sourcePath) ? new Date(QUEUED_PATHS[sourcePath].ctime) : null
}

function enqueue (sourcePath) {
  const job = {
    ctime: Date.now(),
    sourcePath,
    events: [],
    done: false
  }
  QUEUED_PATHS[sourcePath] = job
  JOB_QUEUE.add(XFORM_JOB_NAME, job)
}

function recordJobEvent (qjob, event, description = '') {
  const sourcePath = qjob.data.sourcePath
  const job = QUEUED_PATHS[sourcePath]
  if (job) {
    job.events.push({
      name: event,
      time: Date.now(),
      description
    })
    logger.info(`recordJobEvent(${sourcePath}): recorded event: ${event}${description ? `: ${description}` : ''}`)
  } else {
    logger.warn(`recordJobEvent(${sourcePath}): discarding event (path not queued: ${sourcePath}): ${event}${description ? `: ${description}` : ''}`)
  }
}

function sortJobEvents (job) {
  return job.events.sort((e1, e2) => e1.time - e2.time)
}

const MAX_SHOW_DONE_JOB = MAX_JOB_TIME * 2

function getQueue () {
  const jobs = []
  Object.keys(QUEUED_PATHS).forEach((sourcePath) => {
    const job = QUEUED_PATHS[sourcePath]
    if (job) {
      if (job.events && job.events.length && job.events.length >= 1 &&
        Date.now() - job.ctime < MAX_SHOW_DONE_JOB) {
        // copy job then overwrite events with sorted events
        const jobCopy = Object.assign({}, job)
        delete jobCopy.events
        jobCopy.events = sortJobEvents(QUEUED_PATHS[sourcePath])
        jobCopy.firstEvent = jobCopy.events[0].time
        jobCopy.lastEvent = jobCopy.events[jobCopy.events.length - 1].time
        jobs.push(jobCopy)
      }
    } else {
      jobs.push({ sourcePath, disappeared: true })
    }
  })
  // return jobs sorted by most recent first
  return jobs.sort((j1, j2) => j2.firstEvent - j1.firstEvent)
}

export {
  MAX_JOB_TIME,
  initializeQueue, isQueued, isStaleJob, cdate, enqueue, recordJobEvent, getQueue
}
