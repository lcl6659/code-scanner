tagStr := deploys/dev/`/bin/date "+%Y%m%d%H%M"`
fatTagStr := deploys/fat/`/bin/date "+%Y%m%d%H%M"`
rcTagStr := deploys/rc/`/bin/date "+%Y%m%d%H%M"`
prodTagStr := deploys/prod/`/bin/date "+%Y%m%d%H%M"`

default: dev

install:
	@yarn install

lint:
	@yarn lint
	
start:
	@yarn serve

dev:
	@yarn serve

build-prod:
	@yarn build

prod:
	@yarn build
	@serve build

ship:
	@git tag $(tagStr) -m "Dev release"
	@git push upstream $(tagStr)
	@echo $(tagStr) "was pushed success"

ship-fat:
	@git tag $(fatTagStr) -m "Fat release"
	@git push upstream $(fatTagStr)
	@echo $(fatTagStr) "was pushed success"

ship-rc:
	@git tag $(rcTagStr) -m "RC release"
	@git push upstream $(rcTagStr)
	@echo $(rcTagStr) "was pushed success"

ship-prod:
	@while [ -z "$$CONTINUE" ]; do \
		read -r -p "Are you sure want to deploy production? [y/N]: " CONTINUE; \
	done ; \
	[ $$CONTINUE = "y" ] || [ $$CONTINUE = "Y" ] || (echo "Exiting."; exit 1;)
	@echo "will tagging and pushing..."
	@git tag $(prodTagStr) -m "Prod release"
	@git push upstream $(prodTagStr)
	@echo $(prodTagStr) "was tagged and pushed success!"

diff:
	@git diff $(git symbolic-ref --short -q HEAD) upstream/dev
	# git fetch upstream && git diff remotes/upstream/master master > changes.diff

help:
	@echo "   \033[35mmake install\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  install npm packages"
	@echo "   \033[35mmake dev\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  start dev server"
	@echo "   \033[35mmake ship\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  deploy to devspa.jiliguala.com"
	@echo "   \033[35mmake ship-fat\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  deploy to fatspa.jiliguala.com"
	@echo "   \033[35mmake ship-rc\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  deploy to rcspa.jiliguala.com"
	@echo "   \033[35mmake ship-prod\033[0m\033[0m\t\033[0m\t\033[0m\t---  deploy to spa.jiliguala.com"

cleanbr:
	@git branch -r -d upstream/$(branchName) 
	@git push upstream :$(branchName)