# Graph Report - doneReceived  (2026-11-17)

## Corpus Check
- 790 files · ~264,617 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 6, .graphify-bak 1, .base 1)

## Summary
- 4066 nodes · 11632 edges · 207 communities (163 shown, 44 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 303 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e16f43b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- maplibre-gl-shared.mjs
- react-native
- i18n/index.ts
- ui/map-layers.tsx
- server-tasks-api.ts
- operations-chart.tsx
- user/index.ts
- package.json
- use-new-code-glow.ts
- maplibre-gl-worker.mjs
- ds
- ui/rewards-history.tsx
- child-task-card.tsx
- Icon
- yt
- subdividePolygonInternal
- child-card.tsx
- use-child-location-sharing.ts
- fw
- my-tasks.tsx
- date.ts
- api/index.ts
- readPackedEnd
- mvp-full-design-variants.canvas.tsx
- task/index.ts
- writeTag
- Task
- paid-task-card.tsx
- apiRequest
- expo-router
- families-api.ts
- child-devices.tsx
- bus-playback.ts
- parse
- MapWeb
- oe
- session/index.ts
- showToast
- ui/verify-email.tsx
- map/model/types.ts
- evaluate
- populate
- react
- mvp-apple-premium.canvas.tsx
- devDependencies
- hx
- af
- family-events-api.ts
- date-time-picker-sheet.tsx
- root-layout.tsx
- session/index.ts
- expo
- ui/family.tsx
- deadline-field.tsx
- map/map.tsx
- task.ts
- mvp-family-premium-mobile.canvas.tsx
- determineLineBreaks
- ui/transactions.tsx
- maplibre-gl
- config.ts
- server-wishes-api.ts
- family-task-app-wireframes.canvas.tsx
- clone
- layer-preferences.ts
- location-connection.tsx
- step1-onboarding-design.canvas.tsx
- n
- constructor
- transaction-card.tsx
- avatar-cropper.tsx
- pe
- ui/map-zone.tsx
- setPaintProperty
- paths
- en.ts
- l
- operation/index.ts
- ui/edit-profile.tsx
- road-path.ts
- checklist-field.tsx
- hasDebugData
- ui/index.ts
- server-operations-api.ts
- zm
- queryIntersectsFeature
- use-member-map-settings.ts
- create-task-store.ts
- i
- jy
- Expo Router Navigation
- React Native Best Practices
- create-task-form.tsx
- sizes.ts
- scripts
- eh
- en
- family-event-form-page.tsx
- T
- use-pair-device.ts
- loadAndProcessGeoJSON
- paint
- lib/index.ts
- operation/index.ts
- family-color-palettes.canvas.tsx
- Expo Upgrade
- canvases/mvp-c4-business-logic.canvas.tsx
- splitTile
- family-event.tsx
- eh
- obsidian-done/mvp-c4-business-logic.canvas.tsx
- Wu
- oh
- xt
- interpolate
- task-icon-badge.tsx
- api-image.web.tsx
- en
- bar-3d.tsx
- family-color-palettes-new.canvas.tsx
- appendLeaves
- getColorRampTextures
- layout
- ii
- tasks-query.ts
- DoneReceived Project Guidance
- metro.config.js
- Seven-Step Task Definition Form
- kb
- ui/transactions.tsx
- _refreshViews
- update
- ref_cursor
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
- child-location-task.web.ts
- hasApiErrorCode
- date.ts
- get
- keep-in-view.ts
- activity-card.tsx
- _h
- queryRadius
- use-user-avatar-urls.ts
- label.tsx
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
2. `theme` - 204 edges
3. `react` - 204 edges
4. `Icon()` - 155 edges
5. `tracking()` - 118 edges
6. `apiRequest()` - 78 edges
7. `showToast()` - 69 edges
8. `react-native-svg` - 67 edges
9. `useCurrentFamily()` - 53 edges
10. `syncData()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `useOperations()` --indirect_call--> `sortByNewest()`  [INFERRED]
  src/entities/operation/api/operations-query.ts → src/entities/operation/model/operation.ts
- `useMemberMapSettings()` --calls--> `apiRequest()`  [EXTRACTED]
  src/features/location/model/use-member-map-settings.ts → src/shared/api/http.ts
- `useUpdateMemberMapSettings()` --calls--> `apiRequest()`  [EXTRACTED]
  src/features/location/model/use-member-map-settings.ts → src/shared/api/http.ts
- `useMyFamilies()` --indirect_call--> `fetchMyFamilies()`  [INFERRED]
  src/entities/family/api/families-query.ts → src/entities/family/api/families-api.ts
- `Repository Skill Catalog` --references--> `DoneReceived Project Guidance`  [EXTRACTED]
  .claude/skills/README.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Gamified Task Profile Metrics** — obsidian_done_z_исходники_картинки_pasted_image_20260710153839_progress_summary, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_reward_penalty_ledger, obsidian_done_z_исходники_картинки_pasted_image_20260710153839_achievement_tracking [EXTRACTED 1.00]
- **React Native Animation Rules** — _claude_skills_vercel_react_native_skills_rules_animation_derived_value_use_derived_value, _claude_skills_vercel_react_native_skills_rules_animation_gesture_detector_press_gesture_press, _claude_skills_vercel_react_native_skills_rules_animation_gpu_properties_gpu_animation [EXTRACTED 1.00]
- **Task Completion and Reward Flow** — obsidian_done_c4_task_lifecycle, obsidian_done_сделал_получил_mvp_parent_child_reward_flow, obsidian_done_сделал_получил_идеи_retryable_rejection, obsidian_done_сделал_получил_идеи_wallet_reservation_invariant [INFERRED 0.95]

## Communities (207 total, 44 thin omitted)

### Community 0 - "maplibre-gl-shared.mjs"
Cohesion: 0.01
Nodes (83): Ag, Ar, As, aT, b_, Bn, bp, BS (+75 more)

### Community 1 - "react-native"
Cohesion: 0.04
Nodes (46): react-native, DeviceRowProps, styles, EventTileProps, FieldHintProps, styles, PasswordRulesProps, styles (+38 more)

### Community 2 - "i18n/index.ts"
Cohesion: 0.05
Nodes (54): expo-router, WalletRoute(), useParentFunds(), formatMoney(), FundsBar(), FundsBarProps, FundsLegendItem(), FundsLegendItemProps (+46 more)

### Community 3 - "ui/map-layers.tsx"
Cohesion: 0.10
Nodes (29): isSnapshot(), useBusesSocket(), connect(), AddRow(), buildZoneStatuses(), collectRoutes(), Divider(), EmptyRow() (+21 more)

### Community 4 - "server-tasks-api.ts"
Cohesion: 0.11
Nodes (31): AssignmentDto, AttachmentDto, attachmentImage(), cancelServerTask(), checklistBody(), ChildDto, createServerTask(), fetchServerTasks() (+23 more)

### Community 5 - "operations-chart.tsx"
Cohesion: 0.21
Nodes (12): formatMonthShort(), DayWheelOptions, useDayWheel(), Bar3D(), DayColumn(), DayColumnProps, FutureDayColumn(), styles (+4 more)

### Community 6 - "user/index.ts"
Cohesion: 0.06
Nodes (46): expo-linear-gradient, ROLE_COLORS, RoleColors, Child, ChildOverview, ChildProfile, ParentProfile, GeoPoint (+38 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (55): dependencies, @deck.gl/core@^9.4.0, @deck.gl/layers@^9.4.0, @deck.gl/mapbox@^9.4.0, expo-clipboard@~56.0.4, expo-constants@~56.0.27, expo-dev-client@~56.0.27, expo-file-system@~56.0.11 (+47 more)

### Community 8 - "use-new-code-glow.ts"
Cohesion: 0.40
Nodes (4): react-native-reanimated@^4.3.1, react-native-reanimated, EASE_IN_OUT, EASE_OUT

### Community 9 - "maplibre-gl-worker.mjs"
Cohesion: 0.05
Nodes (31): ae(), cn, Db(), et(), I, lb(), li, ln() (+23 more)

### Community 10 - "ds"
Cohesion: 0.07
Nodes (52): ao(), as(), bo(), bs(), co(), cs(), Do(), ds() (+44 more)

### Community 11 - "ui/rewards-history.tsx"
Cohesion: 0.05
Nodes (81): react-native-safe-area-context, HomeRoute(), RewardsHistoryRoute(), TasksRoute(), useFamilyChildren(), useFamilyMembers(), latestRewards(), sumTotals() (+73 more)

### Community 12 - "child-task-card.tsx"
Cohesion: 0.10
Nodes (32): ChildTaskCard(), ChildTaskCardProps, PhotoSource(), PhotoSourceProps, ReportPhotos, styles, TaskCardProps, Step() (+24 more)

### Community 13 - "Icon"
Cohesion: 0.05
Nodes (51): EventTile(), TaskShortViewProps, RewardButton(), RewardButtonProps, RewardVariant, styles, ChildChipProps, ChipChild (+43 more)

### Community 14 - "yt"
Cohesion: 0.05
Nodes (48): A_(), addFeatures(), av(), bv(), Cu(), D_(), detectSdfPatterns(), Dv() (+40 more)

### Community 15 - "subdividePolygonInternal"
Cohesion: 0.05
Nodes (48): addCurrentVertex(), addFeature(), addHalfVertex(), addLine(), ap(), Bp(), cm(), cp() (+40 more)

### Community 16 - "child-card.tsx"
Cohesion: 0.23
Nodes (9): ChildCard(), SnapCarouselOptions, useSnapCarousel(), ChildrenCarousel(), ChildrenCarouselProps, CAROUSEL_GAP, CAROUSEL_GUTTER, CAROUSEL_PEEK (+1 more)

### Community 17 - "use-child-location-sharing.ts"
Cohesion: 0.13
Nodes (28): expo-location, useSessionKind(), CHILD_LOCATION_TASK, startChildLocationTask(), stopChildLocationTask(), isLocationSharingEnabled(), locationSharingKey(), setLocationSharingEnabled() (+20 more)

### Community 18 - "fw"
Cohesion: 0.05
Nodes (43): Aw(), bw(), _C(), Cw(), decodeDictionary(), du(), Dw(), ew() (+35 more)

### Community 19 - "my-tasks.tsx"
Cohesion: 0.09
Nodes (24): EarnGoalCard(), EarnGoalCardProps, Goal, percent(), styles, authorOf(), NO_TASKS, CARDS_PADDING_BOTTOM (+16 more)

### Community 20 - "date.ts"
Cohesion: 0.15
Nodes (22): styles, EventRow(), EventRowProps, FeaturedEventCard(), FeaturedEventCardProps, CalendarPage(), capitalize(), capitalize() (+14 more)

### Community 21 - "api/index.ts"
Cohesion: 0.11
Nodes (24): @tanstack/react-query, createChild(), createFamily(), deleteChild(), joinFamilyByCode(), setChildAvatar(), transferOwnership(), deleteMyAvatar() (+16 more)

### Community 22 - "readPackedEnd"
Cohesion: 0.06
Nodes (39): bg(), ev(), Fg(), $i(), Ig(), jg(), Lg(), Mg() (+31 more)

### Community 23 - "mvp-full-design-variants.canvas.tsx"
Cohesion: 0.16
Nodes (37): BalanceUpdatedScreen(), BroomIcon(), Btn(), CameraScanArt(), ChildScanScreen(), ChildTasksScreen(), CoinStackArt(), CreateTaskScreen() (+29 more)

### Community 24 - "task/index.ts"
Cohesion: 0.21
Nodes (16): reviewServerSubmission(), approveTask(), rejectTask(), isCommentRequired(), isDeadlinePassed(), REJECT_COMMENT_MAX_LENGTH, RejectDecision, rejectReasons (+8 more)

### Community 25 - "writeTag"
Cohesion: 0.07
Nodes (37): q_(), realloc(), tv(), writeBoolean(), writeBooleanField(), writeBytes(), writeBytesField(), writeDouble() (+29 more)

### Community 26 - "Task"
Cohesion: 0.14
Nodes (22): Task, TASK_PHOTOS_MAX, useCancelTask(), CancelTaskButton(), CancelTaskSheet(), NO_PHOTOS, NoteDraftState, useNoteDraft() (+14 more)

### Community 27 - "paid-task-card.tsx"
Cohesion: 0.26
Nodes (16): formatAmount(), TaskCard(), HeroPill(), InfoTileProps, InfoTiles(), TaskBrief(), TaskSheet(), formatClock() (+8 more)

### Community 28 - "apiRequest"
Cohesion: 0.10
Nodes (34): cancelActiveLocationPublish(), errorFrom(), publishChildLocation(), PublishLocationPoint, send(), sessionMatches(), ApiError, apiErrorCode() (+26 more)

### Community 29 - "expo-router"
Cohesion: 0.11
Nodes (28): useChildBalance(), useWishlistProgress(), isWishlistLimitError(), WishRow(), useDeleteWish(), useMyChildBalance(), useMyWishlistOwner(), useUpdateWish() (+20 more)

### Community 30 - "families-api.ts"
Cohesion: 0.12
Nodes (27): createParentInvite(), FamilyDetailsDto, fetchFamilyChildren(), fetchFamilyDetails(), fetchFamilyMembers(), fetchMyFamilies(), previewFamilyInvite(), revokeParentInvite() (+19 more)

### Community 31 - "child-devices.tsx"
Cohesion: 0.08
Nodes (35): DeviceDto, fetchChildDevices(), fetchConnectCode(), PreviewDto, previewPairing(), revokeDevice(), codeLeft(), deviceKeys (+27 more)

### Community 32 - "bus-playback.ts"
Cohesion: 0.13
Nodes (24): Bus, RoadMovement, VehicleSnapshot, bearingAt(), bearingBetween(), bearingOnSegment(), BusPlayback, catchUpRate() (+16 more)

### Community 33 - "parse"
Cohesion: 0.08
Nodes (31): br(), _calculate(), checkSubtype(), concat(), Cr(), dr(), er(), error() (+23 more)

### Community 34 - "MapWeb"
Cohesion: 0.17
Nodes (16): busRouteKey(), deviceLabel(), later(), LiveLocation, LocationStore, useLiveHiddenAccess(), useLiveLocations(), useLocationStore (+8 more)

### Community 35 - "oe"
Cohesion: 0.15
Nodes (29): b(), C(), D(), E(), ee(), emplaceBack(), f(), g() (+21 more)

### Community 36 - "session/index.ts"
Cohesion: 0.12
Nodes (33): refreshSession(), lockFile, release(), tryAcquire(), wait(), withRefreshLock(), Session, bumpSessionEpoch() (+25 more)

### Community 37 - "showToast"
Cohesion: 0.26
Nodes (10): ChangeEmailErrorInfo, ChangeEmailPage(), goBack(), styles, ConfirmStep(), formatSeconds(), Props, Props (+2 more)

### Community 38 - "ui/verify-email.tsx"
Cohesion: 0.09
Nodes (29): login(), logout(), register(), resendVerification(), verifyEmail(), authLog(), requestError(), forgetSignUp() (+21 more)

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
Nodes (66): react, react-native-svg, ArrowLeftIcon(), ArrowRightIcon(), BagCheckIcon(), BellIcon(), BusIcon(), CalendarIcon() (+58 more)

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

### Community 47 - "family-events-api.ts"
Cohesion: 0.14
Nodes (20): bodyOf(), createFamilyEvent(), FamilyEventDto, FamilyEventPayload, FamilyEventPersonDto, fetchFamilyEvent(), fetchFamilyEvents(), toFamilyEvent() (+12 more)

### Community 48 - "date-time-picker-sheet.tsx"
Cohesion: 0.17
Nodes (15): clampDate(), is24HourClock(), DateTimePickerSheetProps, HOURS_12, HOURS_24, MINUTES, pad(), PERIODS (+7 more)

### Community 49 - "root-layout.tsx"
Cohesion: 0.11
Nodes (22): zustand, FRESH_MS, listenAppFocus(), useRefreshOnNavigate(), useServerEvents(), AppEffects(), Providers(), queryClient (+14 more)

### Community 50 - "session/index.ts"
Cohesion: 0.15
Nodes (21): confirmEmailChange(), requestEmailChange(), resendEmailChange(), fetchMe(), meKeys, ChangePasswordPayload, LoginPayload, MessageResponse (+13 more)

### Community 51 - "expo"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+14 more)

### Community 52 - "ui/family.tsx"
Cohesion: 0.05
Nodes (49): useFamilyInvitePreview(), formatInviteCode(), INVITE_CODE_TEMPLATE, InviteRole, isCompleteInviteCode(), FoundInvite, InviteCodeState, InviteCodeStatus (+41 more)

### Community 53 - "deadline-field.tsx"
Cohesion: 0.21
Nodes (15): formatDeadline(), ChipRow(), styles, webInputReset, DeadlineField(), DescriptionInputProps, FormField(), FormFieldProps (+7 more)

### Community 54 - "map/map.tsx"
Cohesion: 0.09
Nodes (8): FamilyMarker, later(), MAP_CENTER, MAP_IMAGES, MAP_STYLE_JSON, MapWeb(), styles, defaultMapColor()

### Community 55 - "task.ts"
Cohesion: 0.14
Nodes (15): CHECKLIST_ITEM_MAX_LENGTH, CHECKLIST_MAX_ITEMS, ChecklistItem, RejectReasonKey, TASK_NOTE_MAX_LENGTH, TaskRejection, TaskState, ChecklistStepPayload (+7 more)

### Community 56 - "mvp-family-premium-mobile.canvas.tsx"
Cohesion: 0.20
Nodes (20): base, Btn(), Field(), Hero(), Img(), MvpFamilyPremiumMobile(), Phone(), PHOTOS (+12 more)

### Community 57 - "determineLineBreaks"
Cohesion: 0.12
Nodes (21): addImageSection(), addTextSection(), _appendSection(), determineAverageLineWidth(), determineLineBreaks(), f_(), g_(), getMaxImageSize() (+13 more)

### Community 58 - "ui/transactions.tsx"
Cohesion: 0.06
Nodes (55): TransactionsRoute(), ChildWalletDto, fetchAllEntries(), fetchServerChildWallet(), MemberDto, depositFunds(), fetchParentFunds(), ParentWalletDto (+47 more)

### Community 59 - "maplibre-gl"
Cohesion: 0.07
Nodes (34): maplibre-gl@6.10.0, maplibre-gl, MapZone, ZonePoint, OSM_SOURCE, MAP_STYLE, draftFillLayer, draftLineLayer (+26 more)

### Community 60 - "config.ts"
Cohesion: 0.14
Nodes (20): expo-localization@~56.0.6, react-i18next@^17.1.6, expo-localization, react-i18next, LanguageMenu(), LanguageMenuProps, OPTIONS, detectLanguage() (+12 more)

### Community 61 - "server-wishes-api.ts"
Cohesion: 0.06
Nodes (49): expo-image-manipulator@~56.0.26, expo-image-manipulator, base(), createServerWish(), deleteServerWish(), fetchServerWishes(), httpsUrl(), reorderServerWishes() (+41 more)

### Community 62 - "family-task-app-wireframes.canvas.tsx"
Cohesion: 0.25
Nodes (18): ChildAvatar(), CoinBadge(), FamilyIllustration(), FamilyTaskAppWireframes(), GoalProgress(), KidBalanceCard(), KidTaskRow(), ParentBalanceCard() (+10 more)

### Community 63 - "clone"
Cohesion: 0.11
Nodes (19): add(), clone(), div(), divByPoint(), filter(), getAndRemove(), _getAndRemoveByKey(), has() (+11 more)

### Community 64 - "layer-preferences.ts"
Cohesion: 0.10
Nodes (21): MapPage(), asBoolean(), asIds(), DEFAULT_CHILD_MARKER_COLOR, DEFAULT_PARENT_MARKER_COLOR, DEFAULT_SECTIONS, DEFAULT_SETTINGS, HIDDEN_FIELD (+13 more)

### Community 65 - "location-connection.tsx"
Cohesion: 0.11
Nodes (16): useSessionFamilyId(), Location, ZonePresence, ZonePresenceState, applyLocationPresence(), ChildPresence, fetchLocationPresence(), LocationPresence (+8 more)

### Community 66 - "step1-onboarding-design.canvas.tsx"
Cohesion: 0.29
Nodes (16): AddChildScreenBody(), ChildCard(), ChildScanQrScreenBody(), FamilyIllustration(), Field(), GhostBtn(), ModeTabs(), notes (+8 more)

### Community 67 - "n"
Cohesion: 0.13
Nodes (17): A(), an(), n(), fy(), gy(), hy(), ji(), k() (+9 more)

### Community 68 - "constructor"
Cohesion: 0.12
Nodes (17): addImages(), calculateScaledKey(), cc(), constructor(), cv(), _down(), Fu(), initializeIndex() (+9 more)

### Community 69 - "transaction-card.tsx"
Cohesion: 0.24
Nodes (16): formatBalance(), formatTransactionTotal(), transactionCode(), BalanceNote(), ChildTransactionCard(), ChildTransactionCardProps, Details(), fullDate() (+8 more)

### Community 70 - "avatar-cropper.tsx"
Cohesion: 0.23
Nodes (12): cropPhoto(), AvatarCropperProps, clamp(), CropperContent(), Offset, styles, touchDistance(), View2D (+4 more)

### Community 71 - "pe"
Cohesion: 0.23
Nodes (16): me(), y_(), b(), be(), d(), _e(), f(), ge() (+8 more)

### Community 72 - "ui/map-zone.tsx"
Cohesion: 0.21
Nodes (9): createLocationZone(), deleteLocationZone(), fetchLocationZones(), LocationZoneInput, updateLocationZone(), useLocationZones(), zonesKeys, MapZonePage() (+1 more)

### Community 73 - "setPaintProperty"
Cohesion: 0.14
Nodes (15): dc(), fc(), fire(), gradientExpression(), _handleOverridablePaintPropertyUpdate(), _handleSpecialPaintPropertyUpdate(), jd(), listens() (+7 more)

### Community 74 - "paths"
Cohesion: 0.13
Nodes (14): expo/tsconfig.base, compilerOptions, baseUrl, ignoreDeprecations, paths, strict, exclude, extends (+6 more)

### Community 75 - "en.ts"
Cohesion: 0.21
Nodes (9): i18next@^26.5.8, i18next, CustomTypeOptions, i18next, DeepStrings, Dictionary, en, ExtraPluralForms (+1 more)

### Community 76 - "l"
Cohesion: 0.14
Nodes (14): ad(), anchorPoint(), bm(), dt(), getTilePoint(), l(), loadGeometry(), lt() (+6 more)

### Community 77 - "operation/index.ts"
Cohesion: 0.15
Nodes (12): MissedReason, Operation, OperationChild, RewardPayload, PERIOD_DAYS, SUMMARY_PERIODS, SummaryPeriod, CAPTION (+4 more)

### Community 78 - "ui/edit-profile.tsx"
Cohesion: 0.08
Nodes (34): changePassword(), DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, VERIFICATION_CODE_LENGTH, checkPasswordRules(), LoginErrors, PASSWORD_RULES (+26 more)

### Community 79 - "road-path.ts"
Cohesion: 0.15
Nodes (14): Edge, gridKey(), isRoutable(), lines(), metersBetween(), MinHeap, Node, nodeKey() (+6 more)

### Community 80 - "checklist-field.tsx"
Cohesion: 0.14
Nodes (18): ChecklistField(), ChecklistFieldProps, styles, webInputReset, webNoOutline, ChecklistHintIcon(), ChecklistPlusIcon(), HANDLE_DOTS (+10 more)

### Community 82 - "hasDebugData"
Cohesion: 0.17
Nodes (13): _addCollisionDebugVertex(), addCollisionDebugVertices(), addDebugCollisionBoxes(), destroy(), destroyDebugData(), generateCollisionDebugBuffers(), getVertexAttributes(), hasDebugData() (+5 more)

### Community 83 - "ui/index.ts"
Cohesion: 0.04
Nodes (50): AuthFootnoteProps, AuthLayoutProps, styles, Button(), ButtonProps, ButtonState, styles, CardButtonProps (+42 more)

### Community 84 - "server-operations-api.ts"
Cohesion: 0.24
Nodes (11): fetchOperations(), operationKeys, operationsQueryOptions(), useOperations(), ChildDto, fetchMissed(), fetchServerOperations(), MissedDto (+3 more)

### Community 85 - "zm"
Cohesion: 0.20
Nodes (12): Am(), Dm(), em(), fm(), jm(), km(), Lm(), nm() (+4 more)

### Community 86 - "queryIntersectsFeature"
Cohesion: 0.20
Nodes (12): dd(), gm(), Gu(), Hm(), Ju(), Ku(), _m(), qu() (+4 more)

### Community 87 - "use-member-map-settings.ts"
Cohesion: 0.13
Nodes (15): FamilyLocation, familyLocationsKeys, fetchFamilyLocations(), useFamilyLocations(), LocationViewer, MapDevice, MapSettingsChanges, mapSettingsKeys (+7 more)

### Community 88 - "create-task-store.ts"
Cohesion: 0.18
Nodes (16): buildCreateTaskPayload(), ChecklistDraftStep, checklistPayload(), FormActions, FormState, initialState, stepKey(), useCreateTaskStore (+8 more)

### Community 89 - "i"
Cohesion: 0.22
Nodes (11): ac(), ay(), cy(), ic(), id(), ly(), oy(), sy() (+3 more)

### Community 90 - "jy"
Cohesion: 0.20
Nodes (11): by(), eb(), ey(), iy(), jy(), ny(), ry(), ty() (+3 more)

### Community 91 - "Expo Router Navigation"
Cohesion: 0.22
Nodes (10): Expo Router Data Loaders, Offline Support and Cancellation, Expo Networking Guidance, Form Sheet Presentation, Route Structure, Native Header Search, Native Tabs, Native Toolbars and Headers (+2 more)

### Community 93 - "create-task-form.tsx"
Cohesion: 0.25
Nodes (12): updateTask(), CreateTaskPayload, UpdateTaskPayload, ChildChip(), useCreateTask(), useUpdateTask(), CreateTaskButton(), createRequestId() (+4 more)

### Community 94 - "sizes.ts"
Cohesion: 0.27
Nodes (11): DayTotals, CHART_HEIGHT, COLUMN_GAP, COLUMN_WIDTH, COLUMN_WIDTH_SELECTED, DATE_CHIP_HEIGHT, DAY_SLOT_WIDTH, DEPTH_Y (+3 more)

### Community 95 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, android, format, format:check, ios, lint, lint:fix, lint:fsd (+2 more)

### Community 96 - "eh"
Cohesion: 0.20
Nodes (10): ah(), eh(), ih(), jh(), Mh(), nh(), qm(), rh() (+2 more)

### Community 97 - "en"
Cohesion: 0.27
Nodes (10): bc(), completeTask(), process(), processTask(), receive(), Sc(), sendAsync(), vc() (+2 more)

### Community 98 - "family-event-form-page.tsx"
Cohesion: 0.23
Nodes (8): useViewerRole(), useViewerRoleStore, ViewerRoleState, CreateFamilyEventPage(), EditFamilyEventPage(), FamilyEventFormPage(), FamilyEventFormPageProps, styles

### Community 99 - "T"
Cohesion: 0.29
Nodes (10): Y, z, _finishRequestTiming(), _getEtagUnmodifiedResult(), _getExpiryData(), loadData(), loadTile(), _parseWorkerTile() (+2 more)

### Community 100 - "use-pair-device.ts"
Cohesion: 0.24
Nodes (10): react-native-mmkv, connectCodeForApi(), pairChildDevice(), usePairDevice(), capitalize(), deviceLabel(), webLabel(), installationId() (+2 more)

### Community 101 - "loadAndProcessGeoJSON"
Cohesion: 0.25
Nodes (9): dy(), r(), cn(), ln(), _filterGeoJSON(), _getFilterPredicate(), loadAndProcessGeoJSON(), oe() (+1 more)

### Community 102 - "paint"
Cohesion: 0.22
Nodes (9): gC(), Hc(), hp(), nb(), ng(), paint(), qx(), Vd() (+1 more)

### Community 103 - "lib/index.ts"
Cohesion: 0.09
Nodes (40): formatRewardShort(), TaskAssignee, AssigneeAvatar(), AssigneeAvatarProps, styles, ChildReviewRow(), ChildReviewRowProps, styles (+32 more)

### Community 104 - "operation/index.ts"
Cohesion: 0.27
Nodes (8): KindColors, OPERATION_KIND_COLORS, OperationKind, KindCube(), DaySummaryProps, styles, Total(), TotalProps

### Community 105 - "family-color-palettes.canvas.tsx"
Cohesion: 0.35
Nodes (10): BASE, FamilyColorPalettes(), FamilyTheme, MiniPhone(), SOFT, Swatch(), ThemeCardClean(), THEMES (+2 more)

### Community 106 - "Expo Upgrade"
Cohesion: 0.25
Nodes (8): expo-audio Migration, expo-video Migration, Native Tabs Migration, New Architecture, React 19, React Compiler, Expo Router Migration, Expo Upgrade

### Community 107 - "canvases/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

### Community 108 - "splitTile"
Cohesion: 0.36
Nodes (8): addTileFeatures(), getTile(), Hh(), initialize(), invalidateTiles(), kh(), splitTile(), updateIndex()

### Community 109 - "family-event.tsx"
Cohesion: 0.17
Nodes (15): cancelFamilyEvent(), respondToFamilyEvent(), useSessionUser(), useCancelFamilyEvent(), useFamilyEvent(), RespondInput, useRespondFamilyEvent(), capitalize() (+7 more)

### Community 110 - "eh"
Cohesion: 0.25
Nodes (8): ch(), im(), lh(), sh(), Sm(), wm(), xm(), zh()

### Community 111 - "obsidian-done/mvp-c4-business-logic.canvas.tsx"
Cohesion: 0.42
Nodes (9): Arrow(), C4Kind, C4Node(), ContainerDiagram(), ContextDiagram(), EntityTable(), FlowDiagram(), MvpC4BusinessLogic() (+1 more)

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

### Community 116 - "task-icon-badge.tsx"
Cohesion: 0.33
Nodes (5): BadgeSize, GRADIENTS, ICON_SIZE, styles, TaskIconBadgeProps

### Community 117 - "api-image.web.tsx"
Cohesion: 0.38
Nodes (6): ApiImage(), HeaderSource, load(), loaded, ready, withHeaders()

### Community 118 - "en"
Cohesion: 0.24
Nodes (10): Cn(), en(), hn(), mn(), nn(), qt(), rn(), Sn() (+2 more)

### Community 119 - "bar-3d.tsx"
Cohesion: 0.20
Nodes (9): DEPTH_X, FUTURE_BAR_HEIGHT, Bar3DProps, Block, Cube(), CubeColors, CubeProps, FUTURE_COLORS (+1 more)

### Community 120 - "family-color-palettes-new.canvas.tsx"
Cohesion: 0.44
Nodes (8): FamilyColorPalettesNew(), FamilyTheme, MiniPhone(), Swatch(), ThemePreview(), THEMES, tint(), WelcomeBlock()

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

### Community 125 - "tasks-query.ts"
Cohesion: 0.36
Nodes (7): TaskViewer, fetchTasks(), taskKeys, useTasks(), group(), sortTasksByUrgency(), time()

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

### Community 130 - "ui/transactions.tsx"
Cohesion: 0.17
Nodes (10): ChildFilter, ParentFilter, ScreenProps, styles, Tone, GRADIENTS, Option, SegmentedFilter() (+2 more)

### Community 131 - "_refreshViews"
Cohesion: 0.40
Nodes (5): freeBufferAfterUpload(), _refreshViews(), reserve(), resize(), _trim()

### Community 132 - "update"
Cohesion: 0.40
Nodes (5): update(), _updateDomImage(), _updateRawData(), _uploadDomImage(), _uploadRawData()

### Community 133 - "ref_cursor"
Cohesion: 0.36
Nodes (6): MainScreensComparison(), Phone(), Theme, ThemeRow(), THEMES, tint()

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
Cohesion: 0.23
Nodes (15): useCurrentFamily(), EventPersonChip(), useSaveFamilyEvent(), createRequestId(), defaultReminderLead(), defaultStart(), FamilyEventForm(), FamilyEventFormProps (+7 more)

### Community 186 - "hasApiErrorCode"
Cohesion: 0.16
Nodes (20): RequestError, attemptsLeft(), ChangeEmailError, commonError(), confirmEmailChangeError(), info(), requestEmailChangeError(), ChangePasswordError (+12 more)

### Community 187 - "date.ts"
Cohesion: 0.18
Nodes (14): useFamilyEventsQuery(), getDayTotals(), getHistoryDays(), isSameDay(), EMPTY_EVENTS, useFamilyEvents(), addDays(), endOfDay() (+6 more)

### Community 190 - "get"
Cohesion: 0.29
Nodes (8): backfillBorder(), get(), _getByteView(), getPixels(), _idx(), sampleBilinear(), unpack(), _unpackAtIndex()

### Community 191 - "keep-in-view.ts"
Cohesion: 0.32
Nodes (7): currentOffset(), KeepInView, KeepInViewContext, keepInViewScrollStyle, measure(), Rect, useKeepInView()

### Community 192 - "activity-card.tsx"
Cohesion: 0.11
Nodes (22): ActivityDto, ChildDto, fetchFeed(), KNOWN, MemberDto, FEED_LIMIT, feedKeys, useFeed() (+14 more)

### Community 193 - "_h"
Cohesion: 0.40
Nodes (5): bh(), finish(), _h(), vh(), yh()

### Community 194 - "queryRadius"
Cohesion: 0.50
Nodes (4): cg(), nd(), queryRadius(), rd()

### Community 201 - "use-user-avatar-urls.ts"
Cohesion: 0.50
Nodes (4): avatarCache, AvatarUser, loadAvatar(), useUserAvatarUrls()

### Community 202 - "label.tsx"
Cohesion: 0.50
Nodes (3): @rn-primitives/label@^1.5.2, @rn-primitives/label, styles

## Knowledge Gaps
- **45 isolated node(s):** `Cancelled`, `Done`, `Pending`, `expo/tsconfig.base`, `expo-audio Migration` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1049 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react-native`, `i18n/index.ts`, `ui/map-layers.tsx`, `ui/transactions.tsx`, `ref_cursor`, `user/index.ts`, `package.json`, `use-new-code-glow.ts`, `operations-chart.tsx`, `ui/rewards-history.tsx`, `child-task-card.tsx`, `Icon`, `child-card.tsx`, `use-child-location-sharing.ts`, `my-tasks.tsx`, `api/index.ts`, `mvp-full-design-variants.canvas.tsx`, `task/index.ts`, `Task`, `expo-router`, `child-devices.tsx`, `bus-playback.ts`, `family-event-form.tsx`, `showToast`, `ui/verify-email.tsx`, `mvp-apple-premium.canvas.tsx`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `ui/family.tsx`, `deadline-field.tsx`, `map/map.tsx`, `mvp-family-premium-mobile.canvas.tsx`, `ui/transactions.tsx`, `date.ts`, `maplibre-gl`, `server-wishes-api.ts`, `family-task-app-wireframes.canvas.tsx`, `keep-in-view.ts`, `location-connection.tsx`, `step1-onboarding-design.canvas.tsx`, `transaction-card.tsx`, `avatar-cropper.tsx`, `use-user-avatar-urls.ts`, `operation/index.ts`, `ui/edit-profile.tsx`, `checklist-field.tsx`, `ui/index.ts`, `create-task-form.tsx`, `lib/index.ts`, `operation/index.ts`, `family-color-palettes.canvas.tsx`, `canvases/mvp-c4-business-logic.canvas.tsx`, `family-event.tsx`, `obsidian-done/mvp-c4-business-logic.canvas.tsx`, `api-image.web.tsx`, `family-color-palettes-new.canvas.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `Cancelled`, `Done`, `Pending` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `maplibre-gl-shared.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.005952380952380952 - nodes in this community are weakly interconnected._
- **Why does `react-native` connect `react-native` to `i18n/index.ts`, `ui/map-layers.tsx`, `ui/transactions.tsx`, `operations-chart.tsx`, `user/index.ts`, `package.json`, `ui/rewards-history.tsx`, `child-task-card.tsx`, `Icon`, `child-card.tsx`, `use-child-location-sharing.ts`, `my-tasks.tsx`, `date.ts`, `api/index.ts`, `task/index.ts`, `Task`, `paid-task-card.tsx`, `expo-router`, `child-devices.tsx`, `family-event-form.tsx`, `showToast`, `ui/verify-email.tsx`, `family-events-api.ts`, `date-time-picker-sheet.tsx`, `root-layout.tsx`, `session/index.ts`, `ui/family.tsx`, `deadline-field.tsx`, `map/map.tsx`, `task.ts`, `ui/transactions.tsx`, `date.ts`, `maplibre-gl`, `server-wishes-api.ts`, `keep-in-view.ts`, `activity-card.tsx`, `transaction-card.tsx`, `avatar-cropper.tsx`, `label.tsx`, `operation/index.ts`, `ui/edit-profile.tsx`, `checklist-field.tsx`, `ui/index.ts`, `create-task-form.tsx`, `sizes.ts`, `family-event-form-page.tsx`, `use-pair-device.ts`, `lib/index.ts`, `operation/index.ts`, `family-event.tsx`, `task-icon-badge.tsx`, `api-image.web.tsx`, `bar-3d.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.04253988113856741 - nodes in this community are weakly interconnected._
- **Why does `maplibre-gl` connect `maplibre-gl` to `lib/index.ts`, `map/model/types.ts`, `road-path.ts`, `package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `i18n/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05006839945280438 - nodes in this community are weakly interconnected._