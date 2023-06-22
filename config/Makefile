SHELL:= /bin/bash
.SILENT:
MAKEFLAGS += --warn-undefined-variables

GH_ORG=KookaS
GH_REPO=scraper-frontend

export GH_PATH GH_BRANCH OVERRIDE_EXTENSION OUTPUT_FOLDER

gh-load-folder:
	$(eval res=$(shell curl -L \
		-H "Accept: application/vnd.github+json" \
		-H "Authorization: Bearer ${GITHUB_TOKEN}" \
		-H "X-GitHub-Api-Version: 2022-11-28" \
		https://api.github.com/repos/${GH_ORG}/${GH_REPO}/contents/${GH_PATH}?ref=${GH_BRANCH} | jq -c '.[] | .path'))
	for file in ${res}; do \
		make -f ${MAKEFILE} gh-load-file OUTPUT_FOLDER=${OUTPUT_FOLDER} GH_PATH="$$file"; \
    done
gh-load-file:
	curl -L -o ${OUTPUT_FOLDER}/$(shell basename ${GH_PATH} | cut -d. -f1)_${OVERRIDE_EXTENSION}$(shell [[ "${GH_PATH}" = *.* ]] && echo .$(shell basename ${GH_PATH} | cut -d. -f2) || echo '') \
			-H "Accept: application/vnd.github.v3.raw" \
			-H "Authorization: Bearer ${GITHUB_TOKEN}" \
			-H "X-GitHub-Api-Version: 2022-11-28" \
			https://api.github.com/repos/${GH_ORG}/${GH_REPO}/contents/${GH_PATH}?ref=${GH_BRANCH}

.ONESHELL: prepare-scraper-frontend
prepare-scraper-frontend:
	cat <<-EOF > ${OUTPUT_FOLDER}/${OVERRIDE_EXTENSION}.env
		NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
		PORT=${PORT}
	EOF
	make -f ${MAKEFILE} gh-load-folder GH_PATH=config