# Graph Report - doneReceived  (2026-11-19)

## Corpus Check
- 801 files · ~271,014 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .graphify-bak 1, .base 1)

## Summary
- 4169 nodes · 11777 edges · 243 communities (160 shown, 83 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 304 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ff2e1c76`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- TabScreen
- task-short-view.tsx
- task/index.ts
- bar-3d.tsx
- expo-linear-gradient
- package.json
- PickedPhoto
- maplibre-gl-worker.mjs
- ds
- ui/family.tsx
- publish-location.ts
- child-task-card.tsx
- yt
- subdividePolygonInternal
- use-child-location-sharing.ts
- child-devices.tsx
- fw
- ui/map-layers.tsx
- location-sharing-card.tsx
- map.web.tsx
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- http.ts
- writeTag
- api/index.ts
- ui/map-zone.tsx
- families-api.ts
- react
- ui/edit-profile.tsx
- device-api.ts
- bus-playback.ts
- evaluate
- child-wallet.tsx
- oe
- session/index.ts
- task-icon-badge.tsx
- GradientButton
- map/model/types.ts
- evaluate
- populate
- icon-map.ts
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- location-connection.tsx
- ui/index.ts
- wallet.ts
- session/index.ts
- expo
- LetterAvatar
- family-event-form.tsx
- ui/rewards-history.tsx
- http.ts
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- my-tasks.tsx
- zone-map.tsx
- showToast
- widgets/map/index.ts
- family-task-app-wireframes.canvas.tsx
- clone
- layer-preferences.ts
- road-path.ts
- step1-onboarding-design.canvas.tsx
- n
- constructor
- balance-card.tsx
- en.ts
- pe
- config.ts
- setPaintProperty
- paths
- sortable-list.tsx
- l
- date-time-picker-sheet.tsx
- GradientButton
- change-email-error.ts
- confirm-step.tsx
- hasDebugData
- use-location-socket.ts
- transaction-card.tsx
- zm
- parent-invite-code.tsx
- create-task-form.tsx
- home-summary.tsx
- i
- react-native-svg
- Expo Router Navigation
- React Native Best Practices
- Icon
- task-sheet.tsx
- scripts
- eh
- en
- reward-kind-toggle.tsx
- T
- loadAndProcessGeoJSON
- paint
- lib/index.ts
- ui/role-select.tsx
- wish/index.ts
- Expo Upgrade
- ui/tasks.tsx
- splitTile
- root-layout.tsx
- eh
- family-color-palettes.canvas.tsx
- canvases/mvp-c4-business-logic.canvas.tsx
- oh
- queryIntersectsFeature
- interpolate
- task.ts
- jy
- en
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- appendLeaves
- getColorRampTextures
- layout
- ii
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- family-color-palettes-new.canvas.tsx
- _refreshViews
- update
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
- Wu
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
- child-location-task.web.ts
- ref_cursor
- family-event.tsx
- xt
- get
- activity-card.tsx
- _h
- avatar-cropper.tsx
- expo-router
- queryRadius
- ui/family-setup.tsx
- drag-handle.tsx
- bag-check.tsx
- bell.tsx
- bus.tsx
- camera.tsx
- camera-outline.tsx
- I18n and Accessibility Checklist
- Apache License 2.0
- Modern React Native Styling Patterns
- Blue Upward Chevron App Mark
- Monochrome Upward Chevron App Mark
- Geometric Blue Chevron App Icon
- User Profile Concept
- Child Location and Zones
- Repository Commit Format
- expo-clipboard
- cards.tsx
- castle.tsx
- chevron-right.tsx
- children.tsx
- clock.tsx
- close.tsx
- coins.tsx
- external.tsx
- gift.tsx
- globe-outline.tsx
- help.tsx
- home.tsx
- image-add.tsx
- key.tsx
- layers.tsx
- link.tsx
- lock.tsx
- map-fold.tsx
- men.tsx
- parent.tsx
- penalty.tsx
- pencil.tsx
- phone.tsx
- plus.tsx
- price.tsx
- icons/profile.tsx
- sparkle.tsx
- step-dot.tsx
- icons/tasks.tsx
- trash.tsx
- undo.tsx
- zone.tsx

## God Nodes (most connected - your core abstractions)
1. `react-native` - 296 edges
2. `react` - 209 edges
3. `theme` - 200 edges
4. `Icon()` - 145 edges
5. `tracking()` - 118 edges
6. `apiRequest()` - 78 edges
7. `react-native-svg` - 68 edges
8. `showToast()` - 67 edges
9. `@tanstack/react-query` - 52 edges
10. `syncData()` - 50 edges

## Surprising Connections (you probably didn't know these)
- `deleteLocationZone()` --calls--> `apiRequest()`  [EXTRACTED]
  src/entities/zone/api/zones-api.ts → src/shared/api/http.ts
- `useTasks()` --indirect_call--> `sortTasksByUrgency()`  [INFERRED]
  src/entities/task/api/tasks-query.ts → src/entities/task/model/sort-tasks.ts
- `Repository Skill Catalog` --references--> `DoneReceived Project Guidance`  [EXTRACTED]
  .claude/skills/README.md → CLAUDE.md
- `Client State Boundaries` --references--> `DoneReceived Project Guidance`  [EXTRACTED]
  .claude/skills/dr-client-state/SKILL.md → CLAUDE.md
- `Parent Child Reward MVP Flow` --semantically_similar_to--> `Task Reward Lifecycle`  [INFERRED] [semantically similar]
  obsidian-done/Сделал-получил/MVP.md → obsidian-done/C4.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (243 total, 83 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.05
Nodes (38): react-native, PeriodSelectProps, styles, AssigneeAvatarProps, styles, RejectionNoteProps, styles, TILE_GAP (+30 more)

### Community 2 - "TabScreen"
Cohesion: 0.19
Nodes (13): react-native-safe-area-context, useChildBalance(), WishRow(), useWishlistChild(), WishlistChild, ChildWishPage(), ChildWishlistPage(), styles (+5 more)

### Community 3 - "task-short-view.tsx"
Cohesion: 0.21
Nodes (7): TaskShortViewProps, RewardButton(), RewardButtonProps, RewardVariant, styles, styles, TaskShortView()

### Community 4 - "task/index.ts"
Cohesion: 0.06
Nodes (65): useCurrentFamily(), AssignmentDto, AttachmentDto, attachmentImage(), cancelServerTask(), checklistBody(), ChildDto, createServerTask() (+57 more)

### Community 5 - "bar-3d.tsx"
Cohesion: 0.05
Nodes (55): fetchOperations(), operationKeys, operationsQueryOptions(), ChildDto, fetchMissed(), fetchServerOperations(), MissedDto, MissedItemDto (+47 more)

### Community 6 - "expo-linear-gradient"
Cohesion: 0.07
Nodes (39): ROLE_COLORS, RoleColors, Child, ChildProfile, ParentProfile, GeoPoint, Presence, FamilyRole (+31 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (58): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11, expo-font@~56.0.7 (+50 more)

### Community 8 - "PickedPhoto"
Cohesion: 0.15
Nodes (10): expo-image-manipulator, CropRect, RemoteSource, RemoteSource, PhotoPermissionError, PhotoSource, PickedPhoto, pickPhotos() (+2 more)

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (52): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+44 more)

### Community 11 - "ui/family.tsx"
Cohesion: 0.08
Nodes (43): useFamilyMembers(), latestRewards(), sumTotals(), operationsInPeriod(), SummaryPeriod, OperationRow(), PeriodSelect(), useMyId() (+35 more)

### Community 12 - "publish-location.ts"
Cohesion: 0.15
Nodes (7): CHILD_LOCATION_TASK, errorFrom(), LocationSessionBinding, publishChildLocation(), PublishLocationPoint, send(), sessionMatches()

### Community 13 - "child-task-card.tsx"
Cohesion: 0.11
Nodes (40): formatAmount(), ChecklistItem, ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles (+32 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (48): A_(), addFeatures(), av(), bv(), Cu(), D_(), detectSdfPatterns(), Dv() (+40 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.05
Nodes (48): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ap(), Bp(), cm(), cp() (+40 more)

### Community 16 - "use-child-location-sharing.ts"
Cohesion: 0.13
Nodes (24): useSessionFamilyId(), startChildLocationTask(), stopChildLocationTask(), isLocationSharingEnabled(), locationSharingKey(), setLocationSharingEnabled(), storage, initial (+16 more)

### Community 17 - "child-devices.tsx"
Cohesion: 0.14
Nodes (13): DeviceRow(), DeviceRowProps, styles, ConnectDevicePanel(), ConnectDevicePanelProps, formatLeft(), pad(), styles (+5 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 19 - "ui/map-layers.tsx"
Cohesion: 0.06
Nodes (22): AddRow(), buildZoneStatuses(), collectRoutes(), Divider(), EmptyRow(), laterTimestamp(), LayerRow(), LayerRowProps (+14 more)

### Community 20 - "location-sharing-card.tsx"
Cohesion: 0.10
Nodes (10): HistoryData, historyDate(), HistoryDay(), HistoryType, MapHistory(), RouteData, styles, timeLabel() (+2 more)

### Community 21 - "map.web.tsx"
Cohesion: 0.08
Nodes (21): createVehiclesLayer(), zonesToGeoJson(), FamilyMarker, later(), MAP_CENTER, MAP_IMAGES, MAP_STYLE_JSON, MapWeb() (+13 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "http.ts"
Cohesion: 0.14
Nodes (24): useLocationSocket(), connect(), DataChange, currentAccessToken(), getAccessToken(), refreshAccessToken(), NativeWebSocket, openPrivateWebSocket() (+16 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "api/index.ts"
Cohesion: 0.12
Nodes (21): @tanstack/react-query, createFamily(), deleteChild(), joinFamilyByCode(), transferOwnership(), wishesQueryOptions(), wishKeys, WishlistOwner (+13 more)

### Community 27 - "ui/map-zone.tsx"
Cohesion: 0.14
Nodes (18): createLocationZone(), deleteLocationZone(), fetchLocationZones(), LocationZoneInput, updateLocationZone(), useLocationZones(), zonesKeys, MapZone (+10 more)

### Community 28 - "families-api.ts"
Cohesion: 0.07
Nodes (44): Screens(), createChild(), createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies() (+36 more)

### Community 29 - "react"
Cohesion: 0.05
Nodes (35): AuthFootnoteProps, AuthLayoutProps, styles, Button(), ButtonProps, ButtonState, styles, CardButtonProps (+27 more)

### Community 30 - "ui/edit-profile.tsx"
Cohesion: 0.08
Nodes (35): changePassword(), DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, checkPasswordRules(), FieldError, LoginErrors (+27 more)

### Community 31 - "device-api.ts"
Cohesion: 0.12
Nodes (24): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+16 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.10
Nodes (29): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+21 more)

### Community 33 - "evaluate"
Cohesion: 0.08
Nodes (31): br(), _calculate(), checkSubtype(), concat(), Cr(), dr(), er(), error() (+23 more)

### Community 34 - "child-wallet.tsx"
Cohesion: 0.23
Nodes (16): useOperations(), sortByNewest(), useMe(), useSession(), TaskIconBadge(), useChildAccount(), useFamilyOperations(), useMyChildWallet() (+8 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (29): b(), C(), D(), E(), ee(), emplaceBack(), f(), g() (+21 more)

### Community 36 - "session/index.ts"
Cohesion: 0.11
Nodes (33): refreshSession(), lockFile, release(), tryAcquire(), wait(), withRefreshLock(), Session, bumpSessionEpoch() (+25 more)

### Community 37 - "task-icon-badge.tsx"
Cohesion: 0.33
Nodes (5): BadgeSize, GRADIENTS, ICON_SIZE, styles, TaskIconBadgeProps

### Community 38 - "GradientButton"
Cohesion: 0.23
Nodes (9): InviteCodeField(), joinError(), JoinFamilyPanel(), JoinFamilyPanelProps, styles, GradientButton(), AddMember(), Buttons() (+1 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.09
Nodes (18): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+10 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (28): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+20 more)

### Community 42 - "icon-map.ts"
Cohesion: 0.09
Nodes (16): ArrowLeftIcon(), ChequeIcon(), ChevronDownIcon(), ChildIcon(), CodeIcon(), CoinIcon(), CopyIcon(), EyeOffIcon() (+8 more)

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

### Community 47 - "location-connection.tsx"
Cohesion: 0.14
Nodes (17): Location, ZonePresence, ZonePresenceState, deviceLabel(), later(), LiveLocation, LocationStore, useLiveHiddenAccess() (+9 more)

### Community 48 - "ui/index.ts"
Cohesion: 0.04
Nodes (44): ActivityCard(), ActivityCardProps, GRADIENTS, REWARD_STYLES, SUBTITLE_STYLES, styles, styles, EventRowProps (+36 more)

### Community 49 - "wallet.ts"
Cohesion: 0.08
Nodes (42): ChildWalletDto, fetchAllEntries(), fetchServerChildWallet(), MemberDto, ChildDto, fetchAllTransactions(), fetchParentPaidTotal(), fetchServerWallet() (+34 more)

### Community 50 - "session/index.ts"
Cohesion: 0.12
Nodes (26): confirmEmailChange(), deleteMyAvatar(), requestEmailChange(), resendEmailChange(), updateMe(), uploadMyAvatar(), fetchMe(), meKeys (+18 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+14 more)

### Community 52 - "LetterAvatar"
Cohesion: 0.21
Nodes (9): ChildOverview, ChildCard(), ChildCardProps, styles, ChildrenCarouselProps, CAROUSEL_GAP, CAROUSEL_GUTTER, CAROUSEL_PEEK (+1 more)

### Community 53 - "family-event-form.tsx"
Cohesion: 0.07
Nodes (48): bodyOf(), cancelFamilyEvent(), createFamilyEvent(), FamilyEventDto, FamilyEventPayload, FamilyEventPersonDto, fetchFamilyEvent(), fetchFamilyEvents() (+40 more)

### Community 54 - "ui/rewards-history.tsx"
Cohesion: 0.07
Nodes (38): HomeRoute(), RewardsHistoryRoute(), TasksRoute(), TransactionsRoute(), WalletRoute(), getDayTotals(), getHistoryDays(), isSameDay() (+30 more)

### Community 55 - "http.ts"
Cohesion: 0.15
Nodes (10): ApiError, apiErrorCode(), apiUrlFor(), errorMessages(), fromParentDomain(), getSessionScope(), parseRetryAfter(), refreshOnce() (+2 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "my-tasks.tsx"
Cohesion: 0.06
Nodes (61): FeedItem(), group(), sortTasksByUrgency(), time(), Task, useWishlistProgress(), NO_PHOTOS, NoteDraftState (+53 more)

### Community 59 - "zone-map.tsx"
Cohesion: 0.10
Nodes (25): maplibre-gl@6.10.0, maplibre-gl, OSM_SOURCE, MAP_STYLE, draftFillLayer, draftLineLayer, draftPointsLayer, ZONE_DRAFT_LAYER_IDS (+17 more)

### Community 60 - "showToast"
Cohesion: 0.14
Nodes (19): useSessionKind(), useRegisterParentDevice(), LanguageMenu(), LanguageMenuProps, OPTIONS, EditProfilePage(), PhotoChoice, styles (+11 more)

### Community 61 - "widgets/map/index.ts"
Cohesion: 0.29
Nodes (8): HistoryMapLayer(), HISTORY_GAP_COLOR, HistoryMapProps, HistoryMarker, HistoryPoint, routeSegments(), styles, HistoryMapLayer()

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.11
Nodes (19): add(), clone(), div(), divByPoint(), filter(), getAndRemove(), _getAndRemoveByKey(), has() (+11 more)

### Community 64 - "layer-preferences.ts"
Cohesion: 0.13
Nodes (18): asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS, DEFAULT_SETTINGS, HIDDEN_FIELD, HiddenLayerKey (+10 more)

### Community 65 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.13
Nodes (17): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+9 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "balance-card.tsx"
Cohesion: 0.17
Nodes (13): ParentFunds, FundsBar(), FundsBarProps, FundsLegendItem(), FundsLegendItemProps, FundsSegment, styles, RewardBudgetProps (+5 more)

### Community 70 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "config.ts"
Cohesion: 0.16
Nodes (17): expo-localization@~56.0.6, react-i18next@^17.1.6, react-native-mmkv@^4.3.2, expo-localization, react-i18next, react-native-mmkv, detectLanguage(), i18n (+9 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "sortable-list.tsx"
Cohesion: 0.25
Nodes (8): Controller, Layout, RenderArgs, SortableItem(), SortableItemProps, SortableList(), SortableListProps, styles

### Community 76 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 77 - "date-time-picker-sheet.tsx"
Cohesion: 0.17
Nodes (16): clampDate(), endOfDay(), is24HourClock(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES, pad() (+8 more)

### Community 78 - "GradientButton"
Cohesion: 0.16
Nodes (18): login(), logout(), register(), resendVerification(), verifyEmail(), authLog(), forgetSignUp(), rememberSignUp() (+10 more)

### Community 79 - "change-email-error.ts"
Cohesion: 0.22
Nodes (14): RequestError, requestError(), attemptsLeft(), ChangeEmailError, ChangeEmailErrorInfo, commonError(), confirmEmailChangeError(), info() (+6 more)

### Community 80 - "confirm-step.tsx"
Cohesion: 0.24
Nodes (10): useCooldown(), ChangeEmailPage(), goBack(), styles, ConfirmStep(), formatSeconds(), Props, Props (+2 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "use-location-socket.ts"
Cohesion: 0.17
Nodes (7): Message, parse(), RECONNECT_MS, API_URL, EVENTS_WS_URL, LOCATION_WS_URL, wsBaseUrl

### Community 84 - "transaction-card.tsx"
Cohesion: 0.25
Nodes (15): formatBalance(), formatTransactionTotal(), transactionCode(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details(), PayoutNote() (+7 more)

### Community 85 - "zm"
Cohesion: 0.20
Nodes (12): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+4 more)

### Community 86 - "parent-invite-code.tsx"
Cohesion: 0.14
Nodes (15): react-native-reanimated, EASE_IN_OUT, EASE_OUT, useNewCodeGlow(), ResetInviteCodeRow(), ResetInviteCodeRowProps, styles, ResetInviteCodeSheet() (+7 more)

### Community 87 - "create-task-form.tsx"
Cohesion: 0.07
Nodes (57): react, ChildChip(), ChildChipProps, ChipChild, styles, formatMoney(), buildCreateTaskPayload(), ChecklistDraftStep (+49 more)

### Community 88 - "home-summary.tsx"
Cohesion: 0.33
Nodes (6): HomeSummaryProps, card, styles, ACCENT_GRADIENTS, StatCard(), StatCardProps

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "react-native-svg"
Cohesion: 0.12
Nodes (9): react-native-svg, ArrowRightIcon(), BadgeCheckIcon(), CalendarIcon(), CheckIcon(), EyeIcon(), GlobeIcon(), StarIcon() (+1 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "Icon"
Cohesion: 0.04
Nodes (75): expo-linear-gradient, WishProgress, storeUrl(), CHIPS, FILLS, StatusChip(), StatusChipProps, styles (+67 more)

### Community 94 - "task-sheet.tsx"
Cohesion: 0.12
Nodes (19): formatRewardShort(), HERO_GRADIENTS, InfoTileProps, PAPERS, PhotoSectionProps, RewardChip(), RewardChipProps, SHADOWS (+11 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "eh"
Cohesion: 0.20
Nodes (10): ah(), eh(), ih(), jh(), Mh(), nh(), qm(), rh() (+2 more)

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 98 - "reward-kind-toggle.tsx"
Cohesion: 0.33
Nodes (5): GRADIENTS, KINDS, RewardKindToggleProps, SHADOWS, styles

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "lib/index.ts"
Cohesion: 0.11
Nodes (37): TaskAssignee, AssigneeAvatar(), ChildReviewRow(), ChildReviewRowProps, styles, ChildTaskTile(), ChildTaskTileProps, styles (+29 more)

### Community 104 - "ui/role-select.tsx"
Cohesion: 0.15
Nodes (13): pairChildDevice(), useViewerRoleStore, usePairDevice(), Role, ROLES, RoleSelectPage(), styles, capitalize() (+5 more)

### Community 105 - "wish/index.ts"
Cohesion: 0.11
Nodes (33): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+25 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "ui/tasks.tsx"
Cohesion: 0.14
Nodes (16): filterTasks(), CancelTaskButton(), ReviewActions(), authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM (+8 more)

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "root-layout.tsx"
Cohesion: 0.09
Nodes (23): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), useServerEvents(), AppEffects(), Providers(), queryClient, APP_SCREENS (+15 more)

### Community 110 - "eh"
Cohesion: 0.25
Nodes (8): ch(), im(), lh(), sh(), Sm(), wm(), xm(), zh()

### Community 111 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 112 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 113 - "oh"
Cohesion: 0.33
Nodes (7): dh(), fh(), filterUpdate(), oh(), ph(), uh(), updateData()

### Community 114 - "queryIntersectsFeature"
Cohesion: 0.20
Nodes (12): dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m(), qu() (+4 more)

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "task.ts"
Cohesion: 0.29
Nodes (5): CHECKLIST_ITEM_MAX_LENGTH, CHECKLIST_MAX_ITEMS, TASK_NOTE_MAX_LENGTH, TASK_PHOTOS_MAX, TaskRejection

### Community 117 - "jy"
Cohesion: 0.20
Nodes (11): by(), eb(), ey(), iy(), jy(), ny(), ry(), ty() (+3 more)

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+2 more)

### Community 119 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 121 - "appendLeaves"
Cohesion: 0.33
Nodes (6): appendLeaves(), getChildren(), getClusterExpansionZoom(), getLeaves(), getOriginId(), getOriginZoom()

### Community 122 - "getColorRampTextures"
Cohesion: 0.33
Nodes (6): _colorRampChanged(), _createColorRamp(), getColorRampTextures(), getUnpackVector(), Kd(), pack()

### Community 123 - "layout"
Cohesion: 0.33
Nodes (6): eg(), hd(), layout(), pp(), qy(), um()

### Community 124 - "ii"
Cohesion: 0.33
Nodes (6): ai(), Di(), ii(), ni(), oi(), ti()

### Community 126 - "DoneReceived Project Guidance"
Cohesion: 0.40
Nodes (3): Mobile API Security Checklist, Repository Skill Catalog, DoneReceived Project Guidance

### Community 127 - "metro.config.js"
Cohesion: 0.29
Nodes (5): config, { getDefaultConfig }, expo@~56.0.22, { withAppBuildGradle }, expo

### Community 128 - "Seven-Step Task Definition Form"
Cohesion: 0.40
Nodes (5): Reward and Penalty Configuration, Deadline and Recurrence Configuration, Task Creation Screen, Seven-Step Task Definition Form, Task Image and Icon Selection

### Community 129 - "kb"
Cohesion: 0.40
Nodes (5): Ab(), Fb(), jb(), kb(), ob()

### Community 130 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

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

### Community 160 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 186 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

### Community 187 - "family-event.tsx"
Cohesion: 0.11
Nodes (30): EventRow(), EventTile(), FeaturedEventCard(), CalendarPage(), capitalize(), styles, capitalize(), dateRangeLabel() (+22 more)

### Community 188 - "xt"
Cohesion: 0.29
Nodes (7): dn(), jn(), off(), On(), once(), transitioned(), xt()

### Community 190 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 192 - "activity-card.tsx"
Cohesion: 0.12
Nodes (19): ActivityDto, ChildDto, fetchClosedAssignments(), fetchFeed(), isLastRejection(), KNOWN, MemberDto, MissedDto (+11 more)

### Community 193 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 196 - "avatar-cropper.tsx"
Cohesion: 0.22
Nodes (13): cropPhoto(), AvatarCropper(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance() (+5 more)

### Community 199 - "expo-router"
Cohesion: 0.11
Nodes (22): expo-router, useFamilyChildren(), depositFunds(), fetchParentFunds(), ParentWalletDto, toFunds(), useParentFunds(), walletKeys (+14 more)

### Community 201 - "queryRadius"
Cohesion: 0.50
Nodes (4): cg(), nd(), queryRadius(), rd()

### Community 203 - "ui/family-setup.tsx"
Cohesion: 0.10
Nodes (25): useFamilyInvitePreview(), FAMILY_NAME_MAX_LENGTH, formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), RoleIcon(), FoundInvite (+17 more)

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1089 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **83 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `create-task-form.tsx` to `react-native`, `TabScreen`, `task-short-view.tsx`, `task/index.ts`, `bar-3d.tsx`, `expo-linear-gradient`, `package.json`, `ui/family.tsx`, `child-task-card.tsx`, `use-child-location-sharing.ts`, `child-devices.tsx`, `ui/map-layers.tsx`, `location-sharing-card.tsx`, `map.web.tsx`, `mvp-full-design-variants.canvas.tsx`, `http.ts`, `api/index.ts`, `ui/map-zone.tsx`, `react`, `ui/edit-profile.tsx`, `device-api.ts`, `bus-playback.ts`, `child-wallet.tsx`, `GradientButton`, `icon-map.ts`, `mvp-apple-premium.canvas.tsx`, `location-connection.tsx`, `ui/index.ts`, `wallet.ts`, `family-event-form.tsx`, `ui/rewards-history.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `my-tasks.tsx`, `zone-map.tsx`, `showToast`, `widgets/map/index.ts`, `family-task-app-wireframes.canvas.tsx`, `step1-onboarding-design.canvas.tsx`, `sortable-list.tsx`, `date-time-picker-sheet.tsx`, `GradientButton`, `confirm-step.tsx`, `use-location-socket.ts`, `transaction-card.tsx`, `parent-invite-code.tsx`, `home-summary.tsx`, `react-native-svg`, `Icon`, `task-sheet.tsx`, `lib/index.ts`, `ui/role-select.tsx`, `wish/index.ts`, `ui/tasks.tsx`, `root-layout.tsx`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `family-color-palettes-new.canvas.tsx`, `ref_cursor`, `family-event.tsx`, `avatar-cropper.tsx`, `expo-router`, `ui/family-setup.tsx`, `drag-handle.tsx`, `bag-check.tsx`, `bell.tsx`, `bus.tsx`, `camera.tsx`, `camera-outline.tsx`, `cards.tsx`, `castle.tsx`, `chevron-right.tsx`, `children.tsx`, `clock.tsx`, `close.tsx`, `coins.tsx`, `external.tsx`, `gift.tsx`, `globe-outline.tsx`, `help.tsx`, `home.tsx`, `image-add.tsx`, `key.tsx`, `layers.tsx`, `link.tsx`, `lock.tsx`, `map-fold.tsx`, `men.tsx`, `parent.tsx`, `penalty.tsx`, `pencil.tsx`, `phone.tsx`, `plus.tsx`, `price.tsx`, `icons/profile.tsx`, `sparkle.tsx`, `step-dot.tsx`, `icons/tasks.tsx`, `trash.tsx`, `undo.tsx`, `zone.tsx`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `TabScreen`, `task-short-view.tsx`, `bar-3d.tsx`, `expo-linear-gradient`, `package.json`, `PickedPhoto`, `ui/family.tsx`, `child-task-card.tsx`, `use-child-location-sharing.ts`, `child-devices.tsx`, `ui/map-layers.tsx`, `location-sharing-card.tsx`, `map.web.tsx`, `http.ts`, `ui/map-zone.tsx`, `react`, `ui/edit-profile.tsx`, `device-api.ts`, `child-wallet.tsx`, `task-icon-badge.tsx`, `GradientButton`, `ui/index.ts`, `wallet.ts`, `session/index.ts`, `LetterAvatar`, `family-event-form.tsx`, `ui/rewards-history.tsx`, `my-tasks.tsx`, `family-event.tsx`, `showToast`, `widgets/map/index.ts`, `activity-card.tsx`, `avatar-cropper.tsx`, `balance-card.tsx`, `expo-router`, `ui/family-setup.tsx`, `sortable-list.tsx`, `date-time-picker-sheet.tsx`, `GradientButton`, `confirm-step.tsx`, `transaction-card.tsx`, `parent-invite-code.tsx`, `create-task-form.tsx`, `home-summary.tsx`, `Icon`, `task-sheet.tsx`, `reward-kind-toggle.tsx`, `lib/index.ts`, `ui/role-select.tsx`, `wish/index.ts`, `ui/tasks.tsx`, `root-layout.tsx`, `task.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.04810531496062992 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `zone-map.tsx` to `road-path.ts`, `map/model/types.ts`, `package.json`, `lib/index.ts`, `map.web.tsx`, `widgets/map/index.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `task/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05917721518987342 - nodes in this community are weakly interconnected._