// @ts-nocheck
ctx.onmessage = (event: MessageEvent<TrafficWorkerRequestMessage>) => {
  const message = event.data;
  switch (message.type) {
    case `init`: {
      config = { ...message.config };
      sampler = new TrafficDataSampler(config);
      currentRangeMinutes = message.config.defaultRangeMinutes;
      broadcastSnapshot(`init`);
      break;
    }
    case `append`: {
      const timestamp = message.payload.timestamp ?? Date.now();
      const dataPoint: ITrafficDataPoint = {
        up: message.payload.up || 0,
        down: message.payload.down || 0,
        timestamp,
        name: formatTrafficName(timestamp),
      };

      lastTimestamp = timestamp;
      sampler.addDataPoint(dataPoint);
      scheduleSnapshot(`append-throttle`);
      break;
    }
    case `clear`: {
      sampler.clear();
      lastTimestamp = undefined;
      broadcastSnapshot(`clear`);
      break;
    }
    case `setRange`: {
      if (currentRangeMinutes !== message.minutes) {
        currentRangeMinutes = message.minutes;
        broadcastSnapshot(`range-change`);
      }
      break;
    }
    case `requestSnapshot`: {
      broadcastSnapshot(`request`);
      break;
    }
    default:
      break;
  }
};