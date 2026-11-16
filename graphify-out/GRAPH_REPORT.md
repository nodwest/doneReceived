# Graph Report - doneReceived  (2026-11-16)

## Corpus Check
- 737 files · ~239,115 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .graphify-bak 1, .base 1)

## Summary
- 3869 nodes · 10494 edges · 200 communities (155 shown, 45 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 288 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc73a048`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- ui/index.ts
- ui/map-layers.tsx
- server-tasks-api.ts
- ui/transactions.tsx
- user/index.ts
- package.json
- wish-form-sheet.tsx
- maplibre-gl-worker.mjs
- ds
- server-child-profile.tsx
- lib/index.ts
- my-tasks.tsx
- yt
- subdividePolygonInternal
- ui/tasks.tsx
- server-wishes-api.ts
- fw
- bar-3d.tsx
- child-task-card.tsx
- child-home.tsx
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- change-password-error.ts
- writeTag
- ui/family-setup.tsx
- showToast
- uu
- ui/family.tsx
- api/index.ts
- ui/role-select.tsx
- bus-playback.ts
- parse
- zones.ts
- oe
- auth-api.ts
- task-short-view.tsx
- ui/verify-email.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- feed-api.ts
- date-time-picker-sheet.tsx
- root-layout.tsx
- wallet.ts
- expo
- constructor
- create-task-form.tsx
- map.web.tsx
- period-select.tsx
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- checklist-field.tsx
- avatar-cropper.tsx
- config.ts
- PickedPhoto
- family-task-app-wireframes.canvas.tsx
- clone
- map-layers-panel.tsx
- use-register-parent-device.ts
- step1-onboarding-design.canvas.tsx
- n
- constructor
- home-summary.tsx
- parent-home.tsx
- pe
- ui/map-zone.tsx
- setLayoutProperty
- paths
- lib/index.ts
- l
- auth-api.ts
- LetterAvatar
- invite-code-field.tsx
- use-register-parent-device.ts
- hasDebugData
- ui/registration.tsx
- en.ts
- zm
- queryIntersectsFeature
- expo-linear-gradient
- family-color-palettes.canvas.tsx
- i
- jy
- Expo Router Navigation
- React Native Best Practices
- canvases/mvp-c4-business-logic.canvas.tsx
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- scripts
- rh
- en
- ui/role-select.tsx
- T
- family-color-palettes-new.canvas.tsx
- loadAndProcessGeoJSON
- paint
- src_shared_i18n_index_usetranslation
- transaction-card.tsx
- wish-details.tsx
- Expo Upgrade
- ref_cursor
- splitTile
- bottom-nav.tsx
- eh
- evaluate
- Wu
- oh
- xt
- interpolate
- setPaintProperty
- api-image.web.tsx
- en
- validation.ts
- children-filter.tsx
- appendLeaves
- getColorRampTextures
- layout
- addFeature
- xt
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- rewards-history-link.tsx
- _refreshViews
- update
- swipeable-row.tsx
- parse
- Task Reward Lifecycle
- Gamified Household Task Profile Dashboard
- Child Device Pairing Codes
- Retryable Task Rejection
- wrap
- CLAUDE.md
- createIndex
- ot
- Dp
- getClustersInternal
- ov
- setValue
- react-compiler-destructure-functions.md
- Design System Audit
- Frontend JavaScript Security
- Android Icon Background Template
- Application Favicon
- sortFeatures
- bb
- geometryType
- empty
- prepareSegment
- _unit
- withinInto
- expo-clipboard
- Expo Animation Recipes
- Native Platform Menus
- Centered Proportion Guides
- addSymbols
- angleWith
- containsMaxSafeIntegerValues
- crossFadingFactor
- deserializeCollisionBoxes
- dist
- expandBy
- hasOffscreenPass
- interpolationFactor
- l_
- push
- _S
- css.d.ts
- react-state-fallback.md
- rendering-text-in-text-component.md
- scroll-position-no-state.md
- ui-expo-image.md
- ui-image-gallery.md
- ui-measure-views.md
- recalculate
- section-header.tsx
- drag-handle.tsx
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format

## God Nodes (most connected - your core abstractions)
1. `react-native` - 267 edges
2. `react` - 190 edges
3. `theme` - 176 edges
4. `Icon()` - 129 edges
5. `tracking()` - 103 edges
6. `react-native-svg` - 64 edges
7. `@tanstack/react-query` - 48 edges
8. `showToast()` - 47 edges
9. `expo-linear-gradient` - 44 edges
10. `apiRequest()` - 43 edges

## Surprising Connections (you probably didn't know these)
- `RequestError` --calls--> `isApiError()`  [EXTRACTED]
  src/features/auth/model/request-error.ts → src/shared/api/http.ts
- `ChangePasswordError` --calls--> `isApiError()`  [EXTRACTED]
  src/features/change-password/model/change-password-error.ts → src/shared/api/http.ts
- `useJoinFamily()` --indirect_call--> `joinFamilyByCode()`  [INFERRED]
  src/features/join-family/model/use-join-family.ts → src/entities/family/api/families-api.ts
- `useJoinFamilyByCode()` --indirect_call--> `joinFamilyByCode()`  [INFERRED]
  src/features/setup-family/model/use-setup-family.ts → src/entities/family/api/families-api.ts
- `useTasks()` --indirect_call--> `sortTasksByUrgency()`  [INFERRED]
  src/entities/task/api/tasks-query.ts → src/entities/task/model/sort-tasks.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (200 total, 45 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.06
Nodes (29): react-native, FundsBarProps, FundsLegendItemProps, FundsSegment, styles, FieldHintProps, styles, styles (+21 more)

### Community 2 - "ui/index.ts"
Cohesion: 0.04
Nodes (51): CAPTION, OperationRowProps, styles, ChildChip(), ChildChipProps, ChipChild, styles, FILLS (+43 more)

### Community 3 - "ui/map-layers.tsx"
Cohesion: 0.09
Nodes (26): deleteLocationZone(), LocationViewer, useMemberMapSettings(), useUpdateMemberMapSettings(), AddRow(), buildZoneStatuses(), CheckRow(), CheckRowProps (+18 more)

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.05
Nodes (60): useSessionUser(), AssignmentDto, AttachmentDto, attachmentImage(), cancelServerTask(), checklistBody(), ChildDto, createServerTask() (+52 more)

### Community 5 - "ui/transactions.tsx"
Cohesion: 0.08
Nodes (38): RewardsHistoryRoute(), TasksRoute(), TransactionsRoute(), WalletRoute(), getDayTotals(), getHistoryDays(), isSameDay(), TaskIconBadge() (+30 more)

### Community 6 - "user/index.ts"
Cohesion: 0.07
Nodes (39): ROLE_COLORS, RoleColors, Child, ChildProfile, Location, ZonePresence, ZonePresenceState, ParentProfile (+31 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (54): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11, expo-font@~56.0.7 (+46 more)

### Community 8 - "wish-form-sheet.tsx"
Cohesion: 0.08
Nodes (41): createWish(), deleteWish(), fetchWishes(), reorderWishes(), serverFamily(), updateWish(), useWishes(), wishesQueryOptions() (+33 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (21): cn, Db(), et(), I, lb(), li, ln(), Ln (+13 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (53): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+45 more)

### Community 11 - "server-child-profile.tsx"
Cohesion: 0.15
Nodes (22): latestRewards(), sumTotals(), operationsInPeriod(), SummaryPeriod, OperationRow(), PeriodSelect(), useMyId(), useTaskFamilyId() (+14 more)

### Community 12 - "lib/index.ts"
Cohesion: 0.09
Nodes (33): DeviceRow(), DeviceRowProps, styles, formatRewardShort(), TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles (+25 more)

### Community 13 - "my-tasks.tsx"
Cohesion: 0.22
Nodes (13): useChildBalance(), useWishlistProgress(), WishRow(), useWishlistChild(), WishlistChild, ChildWishPage(), ChildWishlistPage(), styles (+5 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (49): A_(), addFeatures(), av(), b(), bv(), Cu(), D_(), detectSdfPatterns() (+41 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.08
Nodes (31): ap(), Bp(), _ensureNoPoleVertices(), _fillPoles(), Fp(), _generateInterEdgeVertices(), _generateIntraEdgeVertices(), _generateOutline() (+23 more)

### Community 16 - "ui/tasks.tsx"
Cohesion: 0.10
Nodes (25): useFamilyMembers(), filterTasks(), authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM, styles (+17 more)

### Community 17 - "server-wishes-api.ts"
Cohesion: 0.27
Nodes (14): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+6 more)

### Community 18 - "fw"
Cohesion: 0.08
Nodes (31): Aw(), bw(), _C(), Cw(), Dw(), ew(), fw(), gw() (+23 more)

### Community 19 - "bar-3d.tsx"
Cohesion: 0.05
Nodes (58): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchServerOperations(), MissedDto, OperationsViewer (+50 more)

### Community 20 - "child-task-card.tsx"
Cohesion: 0.08
Nodes (55): ChecklistItem, ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles, TaskCard() (+47 more)

### Community 21 - "child-home.tsx"
Cohesion: 0.11
Nodes (36): react-native-safe-area-context, useMe(), useSession(), sortTasksByUrgency(), DoneButton(), useChildAccount(), useFamilyOperations(), useMyChildBalance() (+28 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "change-password-error.ts"
Cohesion: 0.28
Nodes (6): changePassword(), ChangePasswordError, ChangePasswordErrorInfo, errorCode(), hasCode(), useChangePassword()

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "ui/family-setup.tsx"
Cohesion: 0.10
Nodes (26): createFamily(), useFamilyInvitePreview(), FAMILY_NAME_MAX_LENGTH, formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), FoundInvite (+18 more)

### Community 27 - "showToast"
Cohesion: 0.11
Nodes (23): deleteMyAvatar(), updateMe(), uploadMyAvatar(), meKeys, useMyAvatar(), useSessionKind(), LanguageMenu(), LanguageMenuProps (+15 more)

### Community 28 - "uu"
Cohesion: 0.17
Nodes (12): decodeDictionary(), du(), getTransition(), getValue(), getValueFromBuffer(), jt(), lw(), offsetToLengthBuffer() (+4 more)

### Community 29 - "ui/family.tsx"
Cohesion: 0.07
Nodes (43): useCurrentFamily(), useFamilyChildren(), countChildTasks(), countTasks(), TaskFilter, depositFunds(), fetchParentFunds(), ParentWalletDto (+35 more)

### Community 30 - "api/index.ts"
Cohesion: 0.06
Nodes (51): @tanstack/react-query, createChild(), createParentInvite(), deleteChild(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers() (+43 more)

### Community 31 - "ui/role-select.tsx"
Cohesion: 0.08
Nodes (34): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+26 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.16
Nodes (20): bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate(), clamp(), createSegment(), distanceMeters() (+12 more)

### Community 33 - "parse"
Cohesion: 0.08
Nodes (30): bh(), br(), checkSubtype(), concat(), Cr(), dr(), error(), finish() (+22 more)

### Community 34 - "zones.ts"
Cohesion: 0.09
Nodes (25): maplibre-gl@6.10.0, maplibre-gl, OSM_SOURCE, MAP_STYLE, draftFillLayer, draftLineLayer, draftPointsLayer, ZONE_DRAFT_LAYER_IDS (+17 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (28): A(), C(), D(), E(), ee(), emplaceBack(), f(), gg() (+20 more)

### Community 36 - "auth-api.ts"
Cohesion: 0.12
Nodes (21): refreshSession(), useSessionFamilyId(), Session, loadSession(), pendingWrite, readSessionForRefresh(), removeSession(), saveSession() (+13 more)

### Community 37 - "task-short-view.tsx"
Cohesion: 0.21
Nodes (7): expo-status-bar, RewardButton(), RewardButtonProps, RewardVariant, styles, styles, TaskShortView()

### Community 38 - "ui/verify-email.tsx"
Cohesion: 0.14
Nodes (20): login(), logout(), register(), resendVerification(), verifyEmail(), authLog(), RequestError, forgetSignUp() (+12 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.06
Nodes (32): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+24 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (29): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+21 more)

### Community 42 - "react"
Cohesion: 0.04
Nodes (60): react, react-native-svg, ArrowLeftIcon(), ArrowRightIcon(), BagCheckIcon(), BellIcon(), BusIcon(), CalendarIcon() (+52 more)

### Community 43 - "mvp-apple-premium.canvas.tsx"
Cohesion: 0.19
Nodes (25): AppleBtn(), AppleField(), AppleLabel(), ApprovalScreen(), BalanceScreen(), ChildTasksScreen(), CreateTaskScreen(), FamilyTheme (+17 more)

### Community 44 - "devDependencies"
Cohesion: 0.09
Nodes (24): { defineConfig }, eslintPluginPrettierRecommended, expoConfig, devDependencies, babel-preset-expo@^57.0.1, eslint@^9.0.0, eslint-config-expo@~56.0.4, eslint-config-prettier@^10.1.8 (+16 more)

### Community 45 - "hx"
Cohesion: 0.08
Nodes (26): ax(), bx(), cx(), dx(), ex(), fx(), gx(), hx() (+18 more)

### Community 46 - "af"
Cohesion: 0.12
Nodes (25): af(), bf(), cf(), df(), ff(), Gf(), Hf(), If() (+17 more)

### Community 47 - "feed-api.ts"
Cohesion: 0.11
Nodes (16): ActivityDto, ChildDto, fetchFeed(), KNOWN, MemberDto, FEED_LIMIT, feedKeys, useFeed() (+8 more)

### Community 48 - "date-time-picker-sheet.tsx"
Cohesion: 0.16
Nodes (16): clampDate(), endOfDay(), is24HourClock(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES, pad() (+8 more)

### Community 49 - "root-layout.tsx"
Cohesion: 0.11
Nodes (16): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), AppEffects(), Providers(), queryClient, useTaskExpirationEvents(), APP_SCREENS (+8 more)

### Community 50 - "wallet.ts"
Cohesion: 0.08
Nodes (40): ChildWalletDto, fetchServerChildWallet(), MemberDto, ChildDto, fetchServerWallet(), TransactionsDto, fetchChildWallet(), fetchWallet() (+32 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (21): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+13 more)

### Community 52 - "constructor"
Cohesion: 0.20
Nodes (11): ae(), R, re(), constructor(), _getAvailableImages(), _getDEMWorkerSource(), _getGlobalState(), _getLayerIndex() (+3 more)

### Community 53 - "create-task-form.tsx"
Cohesion: 0.07
Nodes (43): ChecklistStepPayload, REWARD_PRESETS, buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState, initialState (+35 more)

### Community 54 - "map.web.tsx"
Cohesion: 0.11
Nodes (21): Bus, RoadMovement, VehicleSnapshot, busRouteKey(), isSnapshot(), useBusesSocket(), connect(), VehiclesMessage (+13 more)

### Community 55 - "period-select.tsx"
Cohesion: 0.22
Nodes (8): PeriodSelectProps, styles, AnchorRect, OptionState, SelectMenu(), SelectMenuOption, SelectMenuProps, styles

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "checklist-field.tsx"
Cohesion: 0.18
Nodes (15): ChecklistField(), ChecklistFieldProps, ChecklistHintIcon(), ChecklistPlusIcon(), HANDLE_DOTS, StepHandleIcon(), StepRemoveIcon(), Controller (+7 more)

### Community 59 - "avatar-cropper.tsx"
Cohesion: 0.13
Nodes (18): cropPhoto(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance(), View2D (+10 more)

### Community 60 - "config.ts"
Cohesion: 0.19
Nodes (15): expo-localization@~56.0.6, react-i18next@^17.1.6, react-native-mmkv@^4.3.2, expo-localization, react-i18next, react-native-mmkv, detectLanguage(), resources (+7 more)

### Community 61 - "PickedPhoto"
Cohesion: 0.13
Nodes (16): expo-image-manipulator, NO_PHOTOS, NoteDraftState, useNoteDraft(), useNoteDraftStore, usePhotoDraft(), without(), choosePhotos() (+8 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.07
Nodes (29): add(), backfillBorder(), clone(), div(), divByPoint(), filter(), get(), getAndRemove() (+21 more)

### Community 64 - "map-layers-panel.tsx"
Cohesion: 0.06
Nodes (31): styles, styles, MapPage(), styles, MapWeb(), styles, asBoolean(), asIds() (+23 more)

### Community 65 - "use-register-parent-device.ts"
Cohesion: 0.10
Nodes (9): RegisteredDevice, API_URL, EVENTS_WS_URL, LOCATION_WS_URL, wsBaseUrl, avatarCache, AvatarUser, loadAvatar() (+1 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.22
Nodes (10): an(), n(), fy(), gy(), hy(), ji(), ki(), kn() (+2 more)

### Community 68 - "constructor"
Cohesion: 0.13
Nodes (15): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+7 more)

### Community 69 - "home-summary.tsx"
Cohesion: 0.33
Nodes (6): HomeSummaryProps, card, styles, ACCENT_GRADIENTS, StatCard(), StatCardProps

### Community 70 - "parent-home.tsx"
Cohesion: 0.08
Nodes (6): HomeRoute(), greetingKey(), ParentHomePage(), styles, HomeHeaderProps, styles

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "ui/map-zone.tsx"
Cohesion: 0.14
Nodes (14): createLocationZone(), fetchLocationZones(), LocationZoneInput, updateLocationZone(), useLocationZones(), zonesKeys, MapZone, ZonePoint (+6 more)

### Community 73 - "setLayoutProperty"
Cohesion: 0.29
Nodes (7): dc(), fc(), mc(), pc(), recalculateVisibility(), setLayoutProperty(), _validate()

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "lib/index.ts"
Cohesion: 0.08
Nodes (24): AddChildSheet(), useJoinFamily(), joinError(), JoinFamilyPanel(), JoinFamilyPanelProps, styles, EASE_IN_OUT, EASE_OUT (+16 more)

### Community 76 - "l"
Cohesion: 0.17
Nodes (12): ac(), anchorPoint(), dt(), getTilePoint(), ic(), l(), lt(), map() (+4 more)

### Community 77 - "auth-api.ts"
Cohesion: 0.27
Nodes (11): AccountKind, ChangePasswordPayload, LoginPayload, MessageResponse, PairDevicePayload, PairedDevice, RegisterPayload, SessionFamily (+3 more)

### Community 78 - "LetterAvatar"
Cohesion: 0.13
Nodes (14): ChildOverview, ChildCard(), ChildCardProps, styles, SnapCarouselOptions, useSnapCarousel(), SnapCarouselProps, styles (+6 more)

### Community 79 - "invite-code-field.tsx"
Cohesion: 0.32
Nodes (6): FamilyFound(), FamilyFoundProps, styles, InviteCodeField(), InviteCodeFieldProps, styles

### Community 80 - "use-register-parent-device.ts"
Cohesion: 0.11
Nodes (23): deviceLabel(), later(), LiveLocation, LocationStore, useLiveHiddenAccess(), useLiveLocations(), useLocationStore, FamilyLocation (+15 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "ui/registration.tsx"
Cohesion: 0.11
Nodes (29): expo-router, requestError(), checkPasswordRules(), validateEmail(), validateLogin(), validatePassword(), validateRegistration(), FieldHint() (+21 more)

### Community 84 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 85 - "zm"
Cohesion: 0.22
Nodes (11): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+3 more)

### Community 86 - "queryIntersectsFeature"
Cohesion: 0.11
Nodes (20): ad(), bm(), cg(), dd(), gm(), Gu(), Hm(), Ju() (+12 more)

### Community 87 - "expo-linear-gradient"
Cohesion: 0.06
Nodes (28): expo-linear-gradient, ActivityCardProps, ActivityTone, GRADIENTS, REWARD_STYLES, SUBTITLE_STYLES, styles, BadgeSize (+20 more)

### Community 88 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 89 - "i"
Cohesion: 0.28
Nodes (9): ay(), cy(), id(), iy(), ly(), oy(), sy(), updatePaintArrays() (+1 more)

### Community 90 - "jy"
Cohesion: 0.22
Nodes (10): by(), eb(), ey(), jy(), ny(), ry(), ty(), wy() (+2 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 94 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "rh"
Cohesion: 0.40
Nodes (5): ah(), ih(), jh(), Mh(), rh()

### Community 97 - "en"
Cohesion: 0.31
Nodes (9): bc(), completeTask(), process(), processTask(), Sc(), sendAsync(), vc(), xc() (+1 more)

### Community 98 - "ui/role-select.tsx"
Cohesion: 0.15
Nodes (14): connectCodeForApi(), pairChildDevice(), useViewerRoleStore, usePairDevice(), Role, ROLES, RoleSelectPage(), styles (+6 more)

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 100 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "src_shared_i18n_index_usetranslation"
Cohesion: 0.08
Nodes (43): transferOwnership(), reviewServerSubmission(), approveTask(), cancelTask(), rejectTask(), Task, useCancelTask(), CancelTaskButton() (+35 more)

### Community 104 - "transaction-card.tsx"
Cohesion: 0.23
Nodes (17): formatBalance(), formatTransactionTotal(), transactionCode(), formatDate(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details() (+9 more)

### Community 105 - "wish-details.tsx"
Cohesion: 0.18
Nodes (12): WishProgress, storeUrl(), CHIPS, FILLS, StatusChip(), StatusChipProps, styles, WishDetails() (+4 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "bottom-nav.tsx"
Cohesion: 0.36
Nodes (5): BottomNavItem, NAV_ITEMS, BottomNavProps, NAV_PADDING_VERTICAL, styles

### Community 110 - "eh"
Cohesion: 0.20
Nodes (11): eh(), im(), lh(), nh(), qm(), Sm(), th(), wm() (+3 more)

### Community 111 - "evaluate"
Cohesion: 0.33
Nodes (6): _calculate(), er(), evaluate(), gt(), ko(), possiblyEvaluate()

### Community 112 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 113 - "oh"
Cohesion: 0.25
Nodes (9): ch(), dh(), fh(), filterUpdate(), oh(), ph(), sh(), uh() (+1 more)

### Community 114 - "xt"
Cohesion: 0.50
Nodes (4): jn(), off(), On(), once()

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "setPaintProperty"
Cohesion: 0.33
Nodes (6): gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), setPaintProperty(), _updateColorRamp()

### Community 117 - "api-image.web.tsx"
Cohesion: 0.38
Nodes (6): ApiImage(), HeaderSource, load(), loaded, ready, withHeaders()

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), qt(), receive(), rn(), Sn() (+2 more)

### Community 119 - "validation.ts"
Cohesion: 0.18
Nodes (11): DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, FieldError, LoginErrors, LoginForm, PASSWORD_RULES (+3 more)

### Community 120 - "children-filter.tsx"
Cohesion: 0.25
Nodes (7): ChildFilterValue, ChildrenFilter(), ChildrenFilterProps, FilterChild, Segment(), SegmentProps, styles

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "addFeature"
Cohesion: 0.11
Nodes (24): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ai(), cm(), cp(), Di() (+16 more)

### Community 125 - "xt"
Cohesion: 0.40
Nodes (5): dn(), fire(), listens(), transitioned(), xt()

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.40
Nodes (4): config, { getDefaultConfig }, expo@~56.0.22, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "rewards-history-link.tsx"
Cohesion: 0.50
Nodes (4): BARS, RewardsChartIcon(), RewardsHistoryLink(), styles

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "swipeable-row.tsx"
Cohesion: 0.50
Nodes (4): rubberBand(), styles, SwipeableRow(), SwipeableRowProps

### Community 134 - "parse"
Cohesion: 0.50
Nodes (4): g(), L, parse(), q()

### Community 135 - "Task Reward Lifecycle"
Cohesion: 0.50
Nodes (4): Family Wallet MVP Architecture, Task Reward Lifecycle, Task Creator Mockup, Parent Child Reward MVP Flow

### Community 136 - "Gamified Household Task Profile Dashboard"
Cohesion: 0.67
Nodes (4): Achievement Tracking, Gamified Household Task Profile Dashboard, User Progress Summary, Reward and Penalty Ledger

### Community 137 - "Child Device Pairing Codes"
Cohesion: 0.50
Nodes (3): Family Roles and Permissions, DoneReceived Codex Skill Strategy, DoneReceived Client State Stack

### Community 138 - "Retryable Task Rejection"
Cohesion: 0.50
Nodes (3): Retryable Task Rejection, Task Submission Comment, Per-Assignment Task Checklist

### Community 139 - "wrap"
Cohesion: 0.50
Nodes (4): bt(), distance(), pointOnLine(), wrap()

### Community 141 - "createIndex"
Cohesion: 0.50
Nodes (4): cluster(), createIndex(), createTree(), load()

### Community 142 - "ot"
Cohesion: 0.50
Nodes (4): de(), ot(), pe(), ve()

### Community 143 - "Dp"
Cohesion: 0.50
Nodes (4): Dp(), geometry(), projectLine(), projectPoint()

### Community 144 - "getClustersInternal"
Cohesion: 0.50
Nodes (4): getClusters(), getClustersInternal(), limitZoom(), wh()

### Community 145 - "ov"
Cohesion: 0.50
Nodes (4): ov(), patchUpdatedImage(), patchUpdatedImages(), sv()

### Community 146 - "setValue"
Cohesion: 0.67
Nodes (4): _propertyRootKey(), setTransition(), setValue(), setValues()

### Community 149 - "Frontend JavaScript Security"
Cohesion: 1.00
Nodes (3): Frontend JavaScript Security, React Web Security, Security Best Practices

### Community 151 - "Android Icon Background Template"
Cohesion: 1.00
Nodes (3): Android Icon Background Template, Center Alignment Guides, Circular Icon Safe Zones

### Community 152 - "Application Favicon"
Cohesion: 1.00
Nodes (3): Application Favicon, Blue Chevron Brand Mark, Rounded Square Icon Tile

### Community 153 - "sortFeatures"
Cohesion: 0.67
Nodes (3): addIndicesForPlacedSymbol(), getSortedSymbolIndexes(), sortFeatures()

### Community 154 - "bb"
Cohesion: 0.67
Nodes (3): bb(), url(), xb()

### Community 155 - "geometryType"
Cohesion: 0.67
Nodes (3): containsPolygonGeometry(), geometryType(), getGeometries()

### Community 156 - "empty"
Cohesion: 0.67
Nodes (3): covers(), empty(), intersects()

### Community 157 - "prepareSegment"
Cohesion: 0.67
Nodes (3): createNewSegment(), getOrCreateLatestSegment(), prepareSegment()

### Community 158 - "_unit"
Cohesion: 0.67
Nodes (3): _div(), mag(), _unit()

### Community 159 - "withinInto"
Cohesion: 0.67
Nodes (3): within(), withinInto(), xh()

### Community 187 - "section-header.tsx"
Cohesion: 0.33
Nodes (4): ScreenSectionProps, styles, SectionHeaderProps, styles

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1022 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `ui/index.ts`, `ui/map-layers.tsx`, `ui/transactions.tsx`, `user/index.ts`, `package.json`, `wish-form-sheet.tsx`, `swipeable-row.tsx`, `server-child-profile.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `bar-3d.tsx`, `child-task-card.tsx`, `child-home.tsx`, `mvp-full-design-variants.canvas.tsx`, `ui/family-setup.tsx`, `showToast`, `ui/family.tsx`, `api/index.ts`, `ui/role-select.tsx`, `zones.ts`, `task-short-view.tsx`, `ui/verify-email.tsx`, `mvp-apple-premium.canvas.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `wallet.ts`, `create-task-form.tsx`, `map.web.tsx`, `period-select.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `checklist-field.tsx`, `avatar-cropper.tsx`, `section-header.tsx`, `family-task-app-wireframes.canvas.tsx`, `map-layers-panel.tsx`, `use-register-parent-device.ts`, `step1-onboarding-design.canvas.tsx`, `drag-handle.tsx`, `home-summary.tsx`, `ui/map-zone.tsx`, `lib/index.ts`, `LetterAvatar`, `invite-code-field.tsx`, `use-register-parent-device.ts`, `ui/registration.tsx`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `ui/role-select.tsx`, `family-color-palettes-new.canvas.tsx`, `src_shared_i18n_index_usetranslation`, `transaction-card.tsx`, `wish-details.tsx`, `ref_cursor`, `api-image.web.tsx`, `children-filter.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `ui/index.ts`, `ui/map-layers.tsx`, `server-tasks-api.ts`, `ui/transactions.tsx`, `user/index.ts`, `package.json`, `wish-form-sheet.tsx`, `rewards-history-link.tsx`, `swipeable-row.tsx`, `server-child-profile.tsx`, `lib/index.ts`, `my-tasks.tsx`, `ui/tasks.tsx`, `bar-3d.tsx`, `child-task-card.tsx`, `child-home.tsx`, `ui/family-setup.tsx`, `showToast`, `ui/family.tsx`, `api/index.ts`, `ui/role-select.tsx`, `auth-api.ts`, `task-short-view.tsx`, `ui/verify-email.tsx`, `feed-api.ts`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `wallet.ts`, `create-task-form.tsx`, `period-select.tsx`, `checklist-field.tsx`, `avatar-cropper.tsx`, `section-header.tsx`, `PickedPhoto`, `map-layers-panel.tsx`, `home-summary.tsx`, `parent-home.tsx`, `ui/map-zone.tsx`, `lib/index.ts`, `LetterAvatar`, `invite-code-field.tsx`, `ui/registration.tsx`, `expo-linear-gradient`, `ui/role-select.tsx`, `src_shared_i18n_index_usetranslation`, `transaction-card.tsx`, `wish-details.tsx`, `bottom-nav.tsx`, `api-image.web.tsx`, `children-filter.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.05630630630630631 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `zones.ts` to `ui/map-layers.tsx`, `map/model/types.ts`, `map.web.tsx`, `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04342723004694836 - nodes in this community are weakly interconnected._