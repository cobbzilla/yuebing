Data Volumes and Libraries
==========================

## Introduction to Data Volumes
A data volume is a repository of some data that is connected to Yuebing.

A data volume can be a source volume (read-only) or a destination volume.

You can connect multiple source and destination volumes to yuebing.

A core feature of Yuebing is scanning a source volume for media, transforming it,
and writing processed assets to one or more destination volumes.

### Source Data Volume
A source volume contains some media that yuebing will scan, and transform.

By default, when Yuebing first starts up, there are no source volumes.

### Destination Data Volume
A destination volume contains yuebing system configuration and processed media.

By default, there is always a local system destination data volume available.

#### Synchronized Destinations
A synchronized destination is a destination where the current system will keep a copy
of its important configuration files. These files will be kept in sync and the system can
be booted from either destination.

## Introduction to Libraries
A library consists of:
 * A set of source data volumes where media will be scanned
 * A set of destination data volumes where processed media will be written
 * A database to facilitate searching, tagging, sharing and other features

When a source volume is scanned and processed, the resulting media assets are saved
onto all destinations associated with all libraries in which the source volume participates.

#### Implementation Details
Data volumes are implemented using [mobiletto](https://github.com/cobbzilla/mobiletto).

If you need a low-level tool to work with Yuebing data volumes, try
[mobiletto-cli](https://github.com/cobbzilla/mobiletto-cli) 
