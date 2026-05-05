# Per-project Makefile — delegates to the central multi-stack builder.
# See ~/work/projects/builder/README.md for target list.

BUILDER_PATH ?= ../../builder

# Auto-detect stack; override with STACK=astro / STACK=react / STACK=vite etc.
# STACK ?= astro

include $(BUILDER_PATH)/Makefile
