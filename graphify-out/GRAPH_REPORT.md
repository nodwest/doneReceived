# Graph Report - doneReceived  (2026-11-17)

## Corpus Check
- 781 files · ~256,514 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .graphify-bak 1, .base 1)

## Summary
- 4186 nodes · 10959 edges · 216 communities (170 shown, 46 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 298 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `143c2e02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- expo-linear-gradient
- ui/map-layers.tsx
- server-tasks-api.ts
- operation/index.ts
- user/index.ts
- package.json
- transfer-ownership-button.tsx
- maplibre-gl-worker.mjs
- ds
- server-child-profile.tsx
- lib/index.ts
- Icon
- yt
- subdividePolygonInternal
- child-card.tsx
- task-form-screen.tsx
- fw
- family-calendar.tsx
- child-task-card.tsx
- api/index.ts
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- tasks-header.tsx
- writeTag
- my-tasks.tsx
- ui/profile.tsx
- apiRequest
- bottom-nav/index.ts
- families-api.ts
- child-devices.tsx
- bus-playback.ts
- parse
- zones.ts
- oe
- session/index.ts
- ui/edit-profile.tsx
- ui/verify-email.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- ui/tasks.tsx
- date-time-picker-sheet.tsx
- root-layout.tsx
- auth-api.ts
- expo
- ui/family-setup.tsx
- create-task-form.tsx
- parent-home.tsx
- ui/rewards-history.tsx
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- wallet-query.ts
- maplibre-gl
- config.ts
- PickedPhoto
- family-task-app-wireframes.canvas.tsx
- clone
- layer-preferences.ts
- member-map-settings-sheet.tsx
- step1-onboarding-design.canvas.tsx
- n
- constructor
- ui/calendar.tsx
- ui/change-email.tsx
- pe
- ui/map-zone.tsx
- setPaintProperty
- paths
- wishlist.tsx
- l
- operation.ts
- transaction-card.tsx
- road-path.ts
- server-wishes-api.ts
- hasDebugData
- child-task-card.tsx
- checklist-field.tsx
- zm
- queryIntersectsFeature
- member-map-settings-sheet.tsx
- child-home.tsx
- i
- jy
- Expo Router Navigation
- React Native Best Practices
- ui/change-password.tsx
- task.ts
- scripts
- eh
- en
- wallet.ts
- T
- balance-card.tsx
- loadAndProcessGeoJSON
- paint
- wish.ts
- ui/transactions.tsx
- expo-linear-gradient
- Expo Upgrade
- wish/index.ts
- splitTile
- family-events-api.ts
- eh
- operation/index.ts
- Wu
- oh
- xt
- interpolate
- transaction-row.tsx
- api-image.web.tsx
- en
- ui/family.tsx
- children-filter.tsx
- appendLeaves
- getColorRampTextures
- layout
- ii
- ui/registration.tsx
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- wish-form-sheet.tsx
- _refreshViews
- update
- reject-reason-sheet.tsx
- day-totals.ts
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
- family-event-form.tsx
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
- family-event.tsx
- isApiError
- i18n/index.ts
- keep-in-view.ts
- session/index.ts
- get
- family-event-form-page.tsx
- activity-card.tsx
- _h
- queryRadius
- src_shared_api_index_authorizedimage
- missed-task-card.tsx
- tasks-query.ts
- task-list.tsx
- swipeable-row.tsx
- screen-section.tsx
- parent-invite-code.tsx
- location.ts
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
1. `react-native` - 289 edges
2. `react` - 197 edges
3. `theme` - 152 edges
4. `Icon()` - 106 edges
5. `tracking()` - 90 edges
6. `react-native-svg` - 64 edges
7. `@tanstack/react-query` - 52 edges
8. `apiRequest()` - 46 edges
9. `expo-linear-gradient` - 46 edges
10. `syncData()` - 44 edges

## Surprising Connections (you probably didn't know these)
- `TaskList()` --calls--> `TaskRow()`  [EXTRACTED]
  src/widgets/task-list/ui/task-list.tsx → src/entities/task/ui/task-row.tsx
- `useJoinFamily()` --indirect_call--> `joinFamilyByCode()`  [INFERRED]
  src/features/join-family/model/use-join-family.ts → src/entities/family/api/families-api.ts
- `useEmailChangeWatch()` --indirect_call--> `fetchMe()`  [INFERRED]
  src/features/change-email/model/use-change-email.ts → src/entities/session/api/me-query.ts
- `useConfirmEmailChange()` --indirect_call--> `confirmEmailChange()`  [INFERRED]
  src/features/change-email/model/use-change-email.ts → src/entities/session/api/auth-api.ts
- `useResendEmailChange()` --indirect_call--> `resendEmailChange()`  [INFERRED]
  src/features/change-email/model/use-change-email.ts → src/entities/session/api/auth-api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (216 total, 46 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.05
Nodes (29): react-native, FieldHintProps, HintTone, styles, webInputReset, webNoOutline, webInputReset, EarnGoalCardProps (+21 more)

### Community 2 - "expo-linear-gradient"
Cohesion: 0.04
Nodes (44): react-native-safe-area-context, AuthFootnoteProps, AuthLayoutProps, styles, BottomSheetProps, styles, Button(), ButtonProps (+36 more)

### Community 3 - "ui/map-layers.tsx"
Cohesion: 0.11
Nodes (21): deleteLocationZone(), AddRow(), buildZoneStatuses(), CheckRow(), CheckRowProps, collectRoutes(), EmptyRow(), EPOCH_ISO (+13 more)

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.09
Nodes (40): useSessionUser(), AssignmentDto, AttachmentDto, attachmentImage(), cancelServerTask(), checklistBody(), ChildDto, createServerTask() (+32 more)

### Community 5 - "operation/index.ts"
Cohesion: 0.10
Nodes (30): CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT, DAY_SLOT_WIDTH, DEPTH_X, DEPTH_Y (+22 more)

### Community 6 - "user/index.ts"
Cohesion: 0.08
Nodes (37): DeviceRow(), DeviceRowProps, styles, ROLE_COLORS, RoleColors, Child, ChildProfile, ParentProfile (+29 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (56): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-clipboard@~56.0.4, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11 (+48 more)

### Community 8 - "transfer-ownership-button.tsx"
Cohesion: 0.33
Nodes (8): transferOwnership(), CancelTaskSheet(), useTransferOwnership(), styles, TransferOwnershipButton(), TransferOwnershipButtonProps, BottomSheet(), PillButton()

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (52): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+44 more)

### Community 11 - "server-child-profile.tsx"
Cohesion: 0.12
Nodes (27): latestRewards(), sumTotals(), operationsInPeriod(), SummaryPeriod, OperationRow(), PeriodSelect(), useMyId(), countChildTasks() (+19 more)

### Community 12 - "lib/index.ts"
Cohesion: 0.07
Nodes (44): TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles, ChildReviewRow(), ChildReviewRowProps, styles, ChildTaskTile() (+36 more)

### Community 13 - "Icon"
Cohesion: 0.07
Nodes (28): PeriodSelectProps, styles, TaskShortViewProps, RewardButton(), RewardButtonProps, RewardVariant, styles, FILLS (+20 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (48): A_(), addFeatures(), av(), bv(), Cu(), D_(), detectSdfPatterns(), Dv() (+40 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.05
Nodes (48): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ap(), Bp(), cm(), cp() (+40 more)

### Community 16 - "child-card.tsx"
Cohesion: 0.09
Nodes (20): ChildOverview, ChildCard(), ChildCardProps, styles, HERO_COLORS, ProfileHeroProps, styles, SnapCarouselOptions (+12 more)

### Community 17 - "task-form-screen.tsx"
Cohesion: 0.21
Nodes (14): useFamilyChildren(), useParentFunds(), useWallet(), DepositSheet(), CreateTaskPage(), styles, TaskFormScreen(), TaskFormScreenProps (+6 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 20 - "child-task-card.tsx"
Cohesion: 0.11
Nodes (30): ChildTaskCard(), TaskCard(), TaskCardProps, TaskChecklist(), TaskNote(), HERO_GRADIENTS, HeroPill(), InfoTileProps (+22 more)

### Community 21 - "api/index.ts"
Cohesion: 0.15
Nodes (20): @tanstack/react-query, createChild(), createFamily(), deleteChild(), joinFamilyByCode(), revokeParentInvite(), setChildAvatar(), familiesKeys (+12 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.06
Nodes (79): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+71 more)

### Community 24 - "tasks-header.tsx"
Cohesion: 0.15
Nodes (13): ACCENT_GRADIENT, Owner, OwnerTitle(), SegmentLabel(), SegmentLabelProps, Segments(), SegmentsProps, styles (+5 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "my-tasks.tsx"
Cohesion: 0.15
Nodes (24): Task, NO_PHOTOS, NoteDraftState, useNoteDraft(), useNoteDraftStore, usePhotoDraft(), without(), actionError() (+16 more)

### Community 27 - "ui/profile.tsx"
Cohesion: 0.19
Nodes (13): useMyAvatar(), useSessionKind(), LanguageMenu(), LanguageMenuProps, OPTIONS, ProfileHero(), ProfilePage(), styles (+5 more)

### Community 28 - "apiRequest"
Cohesion: 0.11
Nodes (26): confirmEmailChange(), resendEmailChange(), AFFECTS, DataArea, DataChange, ApiError, apiRequest(), currentAccessToken() (+18 more)

### Community 29 - "bottom-nav/index.ts"
Cohesion: 0.26
Nodes (11): expo-router, useChildBalance(), WishRow(), useWishlistChild(), WishlistChild, ChildWishPage(), ChildWishlistPage(), styles (+3 more)

### Community 30 - "families-api.ts"
Cohesion: 0.13
Nodes (26): createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies(), previewFamilyInvite(), inviteLeft() (+18 more)

### Community 31 - "child-devices.tsx"
Cohesion: 0.07
Nodes (36): TasksRoute(), DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft() (+28 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.16
Nodes (20): bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate(), clamp(), createSegment(), distanceMeters() (+12 more)

### Community 33 - "parse"
Cohesion: 0.08
Nodes (31): br(), _calculate(), checkSubtype(), concat(), Cr(), dr(), er(), error() (+23 more)

### Community 34 - "zones.ts"
Cohesion: 0.12
Nodes (20): Bus, RoadMovement, VehicleSnapshot, busRouteKey(), isSnapshot(), useBusesSocket(), connect(), VehiclesMessage (+12 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (29): b(), C(), D(), E(), ee(), emplaceBack(), f(), g() (+21 more)

### Community 36 - "session/index.ts"
Cohesion: 0.14
Nodes (20): refreshSession(), Session, loadSession(), pendingWrite, readSessionForRefresh(), removeSession(), saveSession(), parseSession() (+12 more)

### Community 37 - "ui/edit-profile.tsx"
Cohesion: 0.12
Nodes (3): EditProfilePage(), PhotoChoice, styles

### Community 38 - "ui/verify-email.tsx"
Cohesion: 0.21
Nodes (14): login(), logout(), register(), resendVerification(), verifyEmail(), authLog(), forgetSignUp(), rememberSignUp() (+6 more)

### Community 39 - "map/model/types.ts"
Cohesion: 0.09
Nodes (18): backgroundLayer, buildings3dLayer, buildingLayer, houseNumbersLayer, landcoverLayer, landuseLayer, parkLayer, citiesMajorLayer (+10 more)

### Community 40 - "evaluate"
Cohesion: 0.13
Nodes (28): aa(), Ba(), ca(), da(), ea(), fa(), ga(), Gi() (+20 more)

### Community 41 - "populate"
Cohesion: 0.08
Nodes (28): addLineDashDependencies(), calculateGlyphDependencies(), _convertFromCellCoord(), _convertToCellCoord(), ed(), es(), _forEachCell(), getId() (+20 more)

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

### Community 47 - "ui/tasks.tsx"
Cohesion: 0.09
Nodes (8): authorOf(), ChildTasksPage(), NO_TASKS, ParentTasksPage(), CARDS_PADDING_BOTTOM, styles, TasksPage(), TasksScope

### Community 48 - "date-time-picker-sheet.tsx"
Cohesion: 0.16
Nodes (16): clampDate(), endOfDay(), is24HourClock(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES, pad() (+8 more)

### Community 49 - "root-layout.tsx"
Cohesion: 0.11
Nodes (15): FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), useServerEvents(), AppEffects(), Providers(), queryClient, APP_SCREENS (+7 more)

### Community 50 - "auth-api.ts"
Cohesion: 0.13
Nodes (20): deleteMyAvatar(), updateMe(), uploadMyAvatar(), fetchMe(), meKeys, useSessionFamilyId(), AccountKind, ChangePasswordPayload (+12 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (21): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+13 more)

### Community 52 - "ui/family-setup.tsx"
Cohesion: 0.06
Nodes (49): useFamilyInvitePreview(), formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), RoleIcon(), FoundInvite, InviteCodeState (+41 more)

### Community 53 - "create-task-form.tsx"
Cohesion: 0.08
Nodes (40): REWARD_PRESETS, buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState, initialState, stepKey() (+32 more)

### Community 54 - "parent-home.tsx"
Cohesion: 0.11
Nodes (3): greetingKey(), ParentHomePage(), styles

### Community 55 - "ui/rewards-history.tsx"
Cohesion: 0.07
Nodes (12): RewardsHistoryRoute(), ChildRewardsHistoryPage(), NO_OPERATIONS, RewardsHistoryPage(), styles, MissedTaskCard(), GRADIENTS, KINDS (+4 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "wallet-query.ts"
Cohesion: 0.20
Nodes (13): ChildWalletDto, fetchServerChildWallet(), MemberDto, ChildDto, fetchServerWallet(), TransactionsDto, fetchChildWallet(), fetchWallet() (+5 more)

### Community 59 - "maplibre-gl"
Cohesion: 0.09
Nodes (25): maplibre-gl@6.10.0, maplibre-gl, OSM_SOURCE, MAP_STYLE, draftFillLayer, draftLineLayer, draftPointsLayer, ZONE_DRAFT_LAYER_IDS (+17 more)

### Community 60 - "config.ts"
Cohesion: 0.11
Nodes (24): expo-localization@~56.0.6, i18next@^26.5.8, react-i18next@^17.1.6, react-native-mmkv@^4.3.2, expo-localization, i18next, react-i18next, react-native-mmkv (+16 more)

### Community 61 - "PickedPhoto"
Cohesion: 0.15
Nodes (10): expo-image-manipulator, CropRect, RemoteSource, RemoteSource, PhotoPermissionError, PhotoSource, PickedPhoto, pickPhotos() (+2 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.11
Nodes (19): add(), clone(), div(), divByPoint(), filter(), getAndRemove(), _getAndRemoveByKey(), has() (+11 more)

### Community 64 - "layer-preferences.ts"
Cohesion: 0.09
Nodes (26): MapPage(), styles, MapWeb(), asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS (+18 more)

### Community 65 - "member-map-settings-sheet.tsx"
Cohesion: 0.09
Nodes (20): deviceLabel(), later(), LiveLocation, LocationStore, useLiveHiddenAccess(), useLiveLocations(), useLocationStore, applyLocationPresence() (+12 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.13
Nodes (17): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+9 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "ui/calendar.tsx"
Cohesion: 0.18
Nodes (3): CalendarPage(), capitalize(), styles

### Community 70 - "ui/change-email.tsx"
Cohesion: 0.11
Nodes (15): requestEmailChange(), ChangeEmailErrorInfo, EMAIL_CHANGE_CHECK_MS, useConfirmEmailChange(), useEmailChangeWatch(), useRequestEmailChange(), useResendEmailChange(), ChangeEmailPage() (+7 more)

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "ui/map-zone.tsx"
Cohesion: 0.18
Nodes (13): createLocationZone(), fetchLocationZones(), LocationZoneInput, updateLocationZone(), useLocationZones(), zonesKeys, MapZone, ZonePoint (+5 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "wishlist.tsx"
Cohesion: 0.19
Nodes (18): WISHLIST_MAX_ITEMS, AddChildSheet(), useDeleteWish(), useMyChildBalance(), useUpdateWish(), PhotoPicker(), WishFormSheet(), MyWishPage() (+10 more)

### Community 76 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 77 - "operation.ts"
Cohesion: 0.14
Nodes (18): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchMissed(), fetchServerOperations(), MissedDto (+10 more)

### Community 78 - "transaction-card.tsx"
Cohesion: 0.25
Nodes (15): formatBalance(), formatTransactionTotal(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details(), fullDate(), PayoutNote() (+7 more)

### Community 79 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 80 - "server-wishes-api.ts"
Cohesion: 0.26
Nodes (15): base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes(), saveServerWishPhotos(), toBody() (+7 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "child-task-card.tsx"
Cohesion: 0.13
Nodes (17): ChecklistItem, ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles, Step(), StepProps (+9 more)

### Community 84 - "checklist-field.tsx"
Cohesion: 0.16
Nodes (16): ChecklistField(), ChecklistFieldProps, styles, ChecklistHintIcon(), ChecklistPlusIcon(), HANDLE_DOTS, StepHandleIcon(), StepRemoveIcon() (+8 more)

### Community 85 - "zm"
Cohesion: 0.20
Nodes (12): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+4 more)

### Community 86 - "queryIntersectsFeature"
Cohesion: 0.20
Nodes (12): dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m(), qu() (+4 more)

### Community 87 - "member-map-settings-sheet.tsx"
Cohesion: 0.13
Nodes (15): FamilyLocation, familyLocationsKeys, fetchFamilyLocations(), useFamilyLocations(), LocationViewer, MapDevice, MapSettingsChanges, mapSettingsKeys (+7 more)

### Community 88 - "child-home.tsx"
Cohesion: 0.09
Nodes (24): HomeRoute(), WalletRoute(), TaskIconBadge(), useMyChildWallet(), useMyWishlistOwner(), authorOf(), ChildHomePage(), greetingKey() (+16 more)

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "jy"
Cohesion: 0.20
Nodes (11): by(), eb(), ey(), iy(), jy(), ny(), ry(), ty() (+3 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "ui/change-password.tsx"
Cohesion: 0.08
Nodes (32): changePassword(), DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, checkPasswordRules(), FieldError, LoginErrors (+24 more)

### Community 94 - "task.ts"
Cohesion: 0.14
Nodes (15): CHECKLIST_ITEM_MAX_LENGTH, CHECKLIST_MAX_ITEMS, RejectReasonKey, TASK_NOTE_MAX_LENGTH, TASK_PHOTOS_MAX, TaskRejection, TaskState, ChecklistStepPayload (+7 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "eh"
Cohesion: 0.20
Nodes (10): ah(), eh(), ih(), jh(), Mh(), nh(), qm(), rh() (+2 more)

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 98 - "wallet.ts"
Cohesion: 0.18
Nodes (16): AnyTransaction, balanceAfter(), CardTransaction, ChildWithdrawal, groupByDay(), isIncome(), PayoutPayload, PayoutTransaction (+8 more)

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 100 - "balance-card.tsx"
Cohesion: 0.11
Nodes (25): depositFunds(), fetchParentFunds(), ParentWalletDto, toFunds(), walletKeys, formatMoney(), getParentFunds(), ParentFunds (+17 more)

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "wish.ts"
Cohesion: 0.24
Nodes (12): useWishlistProgress(), fetchWishes(), useWishes(), wishesQueryOptions(), allocateBalance(), getRewardGoal(), summarizeWishlist(), WishProgress (+4 more)

### Community 104 - "ui/transactions.tsx"
Cohesion: 0.13
Nodes (27): TransactionsRoute(), capitalize(), ChildFilter, ChildTransactionsPage(), openTask(), ParentFilter, ScreenProps, styles (+19 more)

### Community 105 - "expo-linear-gradient"
Cohesion: 0.07
Nodes (24): expo-linear-gradient, BadgeSize, GRADIENTS, ICON_SIZE, styles, TaskIconBadgeProps, AddChildSheetProps, styles (+16 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "wish/index.ts"
Cohesion: 0.20
Nodes (9): createWish(), deleteWish(), reorderWishes(), serverFamily(), wishKeys, WishlistOwner, Move, useReorderWishes() (+1 more)

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "family-events-api.ts"
Cohesion: 0.11
Nodes (22): bodyOf(), createFamilyEvent(), FamilyEventDto, FamilyEventPayload, FamilyEventPersonDto, fetchFamilyEvent(), fetchFamilyEvents(), toFamilyEvent() (+14 more)

### Community 110 - "eh"
Cohesion: 0.25
Nodes (8): ch(), im(), lh(), sh(), Sm(), wm(), xm(), zh()

### Community 111 - "operation/index.ts"
Cohesion: 0.26
Nodes (9): KindColors, OPERATION_KIND_COLORS, formatAmount(), OperationKind, KindCube(), DaySummaryProps, styles, Total() (+1 more)

### Community 112 - "Wu"
Cohesion: 0.33
Nodes (7): cd(), fd(), ld(), pd(), sd(), ud(), Wu()

### Community 113 - "oh"
Cohesion: 0.33
Nodes (7): dh(), fh(), filterUpdate(), oh(), ph(), uh(), updateData()

### Community 114 - "xt"
Cohesion: 0.29
Nodes (7): dn(), jn(), off(), On(), once(), transitioned(), xt()

### Community 115 - "interpolate"
Cohesion: 0.33
Nodes (7): hg(), hr(), interpolate(), mr(), Or(), pr(), _r()

### Community 116 - "transaction-row.tsx"
Cohesion: 0.26
Nodes (12): ChildTransaction, formatTransactionAmount(), Transaction, AMOUNT_STYLES, CardIcon(), ChildTransactionRow(), RowFrame(), RowFrameProps (+4 more)

### Community 117 - "api-image.web.tsx"
Cohesion: 0.38
Nodes (6): ApiImage(), HeaderSource, load(), loaded, ready, withHeaders()

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+2 more)

### Community 119 - "ui/family.tsx"
Cohesion: 0.11
Nodes (7): FamilyPage(), NO_MEMBERS, NO_TASKS, photo(), DELETE_ACTION_WIDTH, REVEAL_GAP, styles

### Community 120 - "children-filter.tsx"
Cohesion: 0.13
Nodes (10): CAPTION, OperationRowProps, styles, ChildFilterValue, ChildrenFilter(), ChildrenFilterProps, FilterChild, Segment() (+2 more)

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

### Community 125 - "ui/registration.tsx"
Cohesion: 0.06
Nodes (11): EMPTY_FORM, Field, Registration(), styles, Role, ROLES, RoleSelectPage(), styles (+3 more)

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

### Community 130 - "wish-form-sheet.tsx"
Cohesion: 0.33
Nodes (6): WISH_PHOTOS_MAX, WishPhotoDraft, useWishForm(), PhotoPickerProps, styles, WishFormSheetProps

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "reject-reason-sheet.tsx"
Cohesion: 0.25
Nodes (13): formatRewardShort(), isCommentRequired(), isDeadlinePassed(), REJECT_COMMENT_MAX_LENGTH, RejectDecision, rejectReasons, reviewError(), useReviewTask() (+5 more)

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

### Community 160 - "family-event-form.tsx"
Cohesion: 0.15
Nodes (9): createRequestId(), defaultReminderLead(), defaultStart(), FamilyEventForm(), FamilyEventFormProps, nextAnnual(), REMINDER_OPTIONS, styles (+1 more)

### Community 185 - "family-event.tsx"
Cohesion: 0.22
Nodes (8): capitalize(), dateRangeLabel(), FamilyEventPage(), REMINDER_KEYS, REMINDER_LEADS, reminderLeadKey(), styles, timeRangeLabel()

### Community 186 - "isApiError"
Cohesion: 0.15
Nodes (20): RequestError, requestError(), attemptsLeft(), ChangeEmailError, commonError(), confirmEmailChangeError(), info(), requestEmailChangeError() (+12 more)

### Community 187 - "i18n/index.ts"
Cohesion: 0.05
Nodes (27): styles, EventRowProps, EventTileProps, FeaturedEventCardProps, CancelTaskSheetProps, styles, BottomNavItem, NAV_ITEMS (+19 more)

### Community 188 - "keep-in-view.ts"
Cohesion: 0.32
Nodes (7): currentOffset(), KeepInView, KeepInViewContext, keepInViewScrollStyle, measure(), Rect, useKeepInView()

### Community 189 - "session/index.ts"
Cohesion: 0.25
Nodes (9): useMe(), useSession(), useChildAccount(), useFamilyOperations(), useFamilyFeed(), useChildTasks(), useFamilyTasks(), useTaskViewer() (+1 more)

### Community 190 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 191 - "family-event-form-page.tsx"
Cohesion: 0.21
Nodes (5): CreateFamilyEventPage(), EditFamilyEventPage(), FamilyEventFormPage(), FamilyEventFormPageProps, styles

### Community 192 - "activity-card.tsx"
Cohesion: 0.08
Nodes (23): ActivityDto, ChildDto, fetchFeed(), KNOWN, MemberDto, FEED_LIMIT, feedKeys, useFeed() (+15 more)

### Community 193 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 194 - "queryRadius"
Cohesion: 0.50
Nodes (4): cg(), nd(), queryRadius(), rd()

### Community 195 - "src_shared_api_index_authorizedimage"
Cohesion: 0.40
Nodes (4): avatarCache, AvatarUser, loadAvatar(), useUserAvatarUrls()

### Community 196 - "missed-task-card.tsx"
Cohesion: 0.10
Nodes (6): MissedTaskCardProps, MissedTaskTile(), MissedTaskTileProps, sameDay(), styles, styles

### Community 197 - "tasks-query.ts"
Cohesion: 0.43
Nodes (6): fetchTasks(), taskKeys, useTasks(), group(), sortTasksByUrgency(), time()

### Community 198 - "task-list.tsx"
Cohesion: 0.40
Nodes (3): styles, TaskList(), TaskListProps

### Community 199 - "swipeable-row.tsx"
Cohesion: 0.50
Nodes (4): rubberBand(), styles, SwipeableRow(), SwipeableRowProps

### Community 204 - "parent-invite-code.tsx"
Cohesion: 0.11
Nodes (21): react-native-reanimated, ConnectDevicePanel(), ConnectDevicePanelProps, formatLeft(), pad(), styles, EASE_IN_OUT, EASE_OUT (+13 more)

### Community 207 - "location.ts"
Cohesion: 0.50
Nodes (3): Location, ZonePresence, ZonePresenceState

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1179 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `wish-form-sheet.tsx`, `ui/map-layers.tsx`, `expo-linear-gradient`, `reject-reason-sheet.tsx`, `user/index.ts`, `package.json`, `transfer-ownership-button.tsx`, `operation/index.ts`, `server-child-profile.tsx`, `lib/index.ts`, `Icon`, `child-card.tsx`, `task-form-screen.tsx`, `family-calendar.tsx`, `child-task-card.tsx`, `api/index.ts`, `mvp-full-design-variants.canvas.tsx`, `my-tasks.tsx`, `ui/profile.tsx`, `bottom-nav/index.ts`, `child-devices.tsx`, `family-event-form.tsx`, `zones.ts`, `ui/edit-profile.tsx`, `mvp-apple-premium.canvas.tsx`, `ui/tasks.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `ui/family-setup.tsx`, `create-task-form.tsx`, `ui/rewards-history.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `family-event.tsx`, `i18n/index.ts`, `keep-in-view.ts`, `session/index.ts`, `family-task-app-wireframes.canvas.tsx`, `maplibre-gl`, `layer-preferences.ts`, `member-map-settings-sheet.tsx`, `step1-onboarding-design.canvas.tsx`, `src_shared_api_index_authorizedimage`, `ui/calendar.tsx`, `ui/change-email.tsx`, `swipeable-row.tsx`, `ui/map-zone.tsx`, `screen-section.tsx`, `task-list.tsx`, `wishlist.tsx`, `parent-invite-code.tsx`, `transaction-card.tsx`, `drag-handle.tsx`, `child-task-card.tsx`, `checklist-field.tsx`, `child-home.tsx`, `ui/change-password.tsx`, `balance-card.tsx`, `wish.ts`, `ui/transactions.tsx`, `expo-linear-gradient`, `operation/index.ts`, `transaction-row.tsx`, `api-image.web.tsx`, `ui/family.tsx`, `children-filter.tsx`, `ui/registration.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `wish-form-sheet.tsx`, `ui/map-layers.tsx`, `expo-linear-gradient`, `reject-reason-sheet.tsx`, `user/index.ts`, `package.json`, `transfer-ownership-button.tsx`, `operation/index.ts`, `server-child-profile.tsx`, `lib/index.ts`, `Icon`, `child-card.tsx`, `task-form-screen.tsx`, `child-task-card.tsx`, `tasks-header.tsx`, `my-tasks.tsx`, `ui/profile.tsx`, `bottom-nav/index.ts`, `child-devices.tsx`, `family-event-form.tsx`, `ui/edit-profile.tsx`, `ui/tasks.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `auth-api.ts`, `ui/family-setup.tsx`, `create-task-form.tsx`, `parent-home.tsx`, `ui/rewards-history.tsx`, `family-event.tsx`, `i18n/index.ts`, `keep-in-view.ts`, `PickedPhoto`, `family-event-form-page.tsx`, `activity-card.tsx`, `layer-preferences.ts`, `missed-task-card.tsx`, `ui/calendar.tsx`, `ui/change-email.tsx`, `swipeable-row.tsx`, `ui/map-zone.tsx`, `screen-section.tsx`, `task-list.tsx`, `wishlist.tsx`, `parent-invite-code.tsx`, `operation.ts`, `transaction-card.tsx`, `child-task-card.tsx`, `checklist-field.tsx`, `member-map-settings-sheet.tsx`, `child-home.tsx`, `ui/change-password.tsx`, `task.ts`, `wallet.ts`, `balance-card.tsx`, `wish.ts`, `ui/transactions.tsx`, `expo-linear-gradient`, `family-events-api.ts`, `operation/index.ts`, `transaction-row.tsx`, `api-image.web.tsx`, `ui/family.tsx`, `children-filter.tsx`, `ui/registration.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.05244096769520498 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `maplibre-gl` to `zones.ts`, `ui/map-layers.tsx`, `map/model/types.ts`, `package.json`, `road-path.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `expo-linear-gradient` be split into smaller, more focused modules?**
  _Cohesion score 0.04341926729986431 - nodes in this community are weakly interconnected._