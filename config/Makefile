SHELL:= /bin/bash
.SILENT:
MAKEFLAGS += --warn-undefined-variables
.ONESHELL:

# error for undefined variables
check_defined = \
    $(strip $(foreach 1,$1, \
        $(call __check_defined,$1,$(strip $(value 2)))))
__check_defined = \
    $(if $(value $1),, \
      $(error Undefined $1$(if $2, ($2))))

prepare:
	$(call check_defined, OVERRIDE_EXTENSION, ENV_FOLDER_PATH, NEXT_PUBLIC_API_URL, PORT)
	cat <<-EOF > ${ENV_FOLDER_PATH}/${OVERRIDE_EXTENSION}.env
		NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
		PORT=${PORT}
	EOF