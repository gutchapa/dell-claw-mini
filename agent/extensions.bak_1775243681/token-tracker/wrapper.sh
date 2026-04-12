#!/bin/bash
# Pi wrapper with token logging
pi "$@" 2>&1 | tee >(grep -E "tokens|usage|cost" >> ~/.pi/token-usage.log)
